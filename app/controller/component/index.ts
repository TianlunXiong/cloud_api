import { Context } from 'koa';
import { Controller, Get, Post } from '@vikit/xnestjs';
import send from 'koa-send';
import path from 'path';
import tmp from 'tmp';
import superagent from 'superagent';
import fs from 'fs';
import rimraf from 'rimraf';
import tar from 'tar';
import { ModelInstance } from '../../service/db';
import { Biz_Component, Biz_Component_Commit } from '../../service/biz';
import MyCOS from '../../service/mycos';
import { Response } from '../../types/response';
import validator, {
  ComponentCommitRequest,
  AddComponentRequest,
  DeleteComponentRequest,
  QueryComponentCommitRequest,
  QueryComponentRequest,
  ComponentReleaseRequest,
} from './validator';
import { pipeline, PassThrough } from 'stream';
import { createGzip } from 'zlib';

const dist = path.resolve(process.cwd(), '../../../dist/component');

@Controller('/api/component')
class ComponentApi {
  constructor(
    protected cos: MyCOS,
    protected db_component: Biz_Component,
    protected db_component_commit: Biz_Component_Commit,
  ) {}

  @Get(':component/:file*')
  async manifest(ctx: Context) {
    const { component, file = '' } = ctx.params;
    const subPath = `/${component}${file ? `/${file}` : ''}`;
    await send(ctx, subPath, {
      root: dist,
      index: 'remoteManifest.js',
      maxage: 0,
    }).catch(() => {});
  }

  @Get('add')
  async add(ctx: Context) {
    const query: AddComponentRequest = ctx.query;
    const result = validator('addComponent', query);
    if (result.valid) {
      ctx.body = await this.db_component.create(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('delete')
  async delete(ctx: Context) {
    const query: DeleteComponentRequest = ctx.query;
    const result = validator('deleteComponent', query);
    if (result.valid) {
      ctx.body = await this.db_component.delete(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('query')
  async query(ctx: Context) {
    const query: QueryComponentRequest = ctx.query;
    const result = validator('queryComponent', query);
    if (result.valid) {
      ctx.body = await this.db_component.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('query_commit')
  async query_commit(ctx: Context) {
    const query: QueryComponentCommitRequest = ctx.query;
    const result = validator('queryCommitComponent', query);
    if (result.valid) {
      ctx.body = await this.db_component_commit.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Post('commit')
  async commit(ctx: Context) {
    const formBody: ComponentCommitRequest = ctx.request.body;
    const files = ctx.request?.files;
    const result = validator('commitComponent', formBody);
    if (!(files && files['file'])) {
      ctx.body = Response.NotSuccess('缺少上传文件');
      return;
    }

    if (!result.valid) {
      ctx.body = Response.NotSuccess('参数错误');
      return;
    }

    const { component_id, package_name, package_version } = formBody;

    const foundComponentUUId = await this.db_component.retrieve({
      component_id,
    });
    if (!foundComponentUUId?.success) {
      ctx.body = Response.NotSuccess('匹配组件失败，请联系管理员');
      return;
    }

    const data: Partial<ModelInstance['component']>[] = foundComponentUUId.data;
    if (data.length === 0) {
      ctx.body = Response.NotSuccess('匹配组件失败，请创建组件');
      return;
    }

    const file = files['file'];
    if (!(file instanceof Array)) {
      const { path: filePath, name } = file;
      try {
        const uuid = this.db_component_commit.getUUID();
        const originURL = await this.cos
          .upload({
            file: filePath,
            dir: uuid,
            name,
          })
          .then(res => {
            return res.url;
          });
        const {
          component_id: found_component_id,
          creator: found_creator,
          component_name: found_component_name,
        } = data[0];
        if (!found_component_id || !found_creator || !found_component_name) {
          ctx.body = Response.NotSuccess('组件信息异常，请联系管理员');
          return;
        }
        ctx.body = await this.db_component_commit.create({
          component_id: component_id,
          creator: found_creator,
          src_url: originURL,
          component_name: found_component_name,
          package_name,
          package_version,
          component_commit_id: uuid,
        });
      } catch (e) {
        ctx.body = Response.Error(e);
      }
    }
  }

  @Get('release')
  async release(ctx: Context) {
    const query: ComponentReleaseRequest = ctx.query;
    const result = validator('releaseComponent', query);
    if (result.valid) {
      const { success, data, error } = await this.db_component_commit.retrieve({
        component_commit_id: query.component_commit_id,
      }, false);
      if (success) {
        const found = (data as ModelInstance['component_commit'][])[0];
        const src = found.src_url;
        const signedURL = await this.cos.getSignedURL(src as string);
        const tmpFile1 = tmp.fileSync({
          postfix: '.tar.gz',
        });
        const fileWriteStream = fs.createWriteStream(tmpFile1.name);
        const req = superagent.get(signedURL);
        req.pipe(fileWriteStream);
        await new Promise(resolve => {
          fileWriteStream.on('finish', () => resolve(true));
        });
        const tmpFile2 = tmp.fileSync({
          postfix: '.tar.gz',
        });

        const tmpDir = tmp.dirSync();
        await tar.extract({
          cwd: tmpDir.name,
          file: tmpFile1.name,
        });
        const filesInDist = fs.readdirSync(tmpDir.name);

        const releaseId = this.db_component_commit.getUUID();

        await tar.c(
          {
            file: tmpFile2.name,
            prefix: `/${releaseId}`,
            preservePaths: false,
            cwd: tmpDir.name,
            gzip: true,
          },
          filesInDist,
        );

        await this.db_component.updateReleaseId(found.component_id, releaseId);

        ctx.body = await this.uploadToCDN(tmpFile2.name);

        rimraf(tmpFile1.name, e => {
          if (e) console.log(e);
        });
        rimraf(tmpFile2.name, e => {
          if (e) console.log(e);
        });
      } else {
      }
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  async uploadToCDN(filename: string) {
    const file = fs.createReadStream(filename);
    const APP_KEY = 'ui-cloud-staging';
    const CDN_UPLOAD = 'http://rock.movie.vip.sankuai.com/api/bona/upload';
    const SECRET_STAGING = '32ED0CAF21FA25864014914D04544122';

    return await superagent
      .post(CDN_UPLOAD)
      .attach('files', file)
      .field('appKey', APP_KEY)
      .field('secretKey', SECRET_STAGING)
      .field('dangerousCover', 0)
      .then(({ body }) => {
        return Response.Success(body);
      })
      .catch(e => {
        Response.NotSuccess(e);
      });
  }
}

@Controller('/cloud/component')
class ComponentCDN extends ComponentApi {
  CDN = 'https://obj.pipi.cn/festatic/ui-cloud-staging';

  @Get(':component_name/:version')
  async manifest(ctx: Context) {
    const { component_name, version = '' } = ctx.params;
    const s = process.uptime();
    const { success, data } = await this.db_component.retrieve({
      component_name,
    }, true);
    if (success && data) {
      ctx.set({
        'Content-Type': 'application/javascript',
        'Content-Encoding': 'gzip'
      });
      const gzip = createGzip();

      ctx.body = superagent.get(
        `${this.CDN}/${
          (data as ModelInstance['component']).latest_release_id
        }/manifest.js`,
      ).pipe(gzip)
    }
  }

  @Get('static/:file+')
  async cdn(ctx: Context) {
    const { file } = ctx.params;
    ctx.body = {
      file,
    };
  }
}

export { ComponentApi, ComponentCDN };
