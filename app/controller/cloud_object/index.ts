import { Context } from 'koa';
import { Controller, Get } from '@vikit/xnestjs';
import { Biz_Cloud_Object, Biz_Cloud_Object_Commit } from '../../service/biz';
import Utils from '../../service/utils';
import {
  AddCloudObject,
  AddCloudObjectCommit,
  DeleteCloudObject,
  QueryCloudObject,
  QueryCloudObjectCommit,
  UpdateCloudObjectCommit,
} from "../../interface/api";

const Response = Utils.Response;

@Controller('/api/v1/cloud_object')
class WidgetApi {
  constructor(
    private utils: Utils,
    private biz_cloud_object: Biz_Cloud_Object,
    private biz_cloud_object_commit: Biz_Cloud_Object_Commit,
  ) {}

  @Get('add')
  async add(ctx: Context) {
    const query = ctx.query as AddCloudObject;
    const result = this.utils.typeValidator(query, 'AddCloudObject')
    if (result?.valid) {
      ctx.body = await this.biz_cloud_object.create(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('delete')
  async delete(ctx: Context) {
    const query = ctx.query as DeleteCloudObject;
    const result = this.utils.typeValidator(query, 'DeleteCloudObject');
    if (result?.valid) {
      ctx.body = await this.biz_cloud_object.delete(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('query')
  async query(ctx: Context) {
    const query = ctx.query as QueryCloudObject;
    const result = this.utils.typeValidator(query, 'QueryCloudObject');
    if (result?.valid) {
      ctx.body = await this.biz_cloud_object.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  // @Get('release')
  // async release_widget(ctx: Context) {
  //   const query = ctx.query as ReleaseCloudObject;
  //   const result = this.utils.typeValidator(query, 'ReleaseCloudObject');
  //   if (result?.valid) {
  //     const { data, success, error } = await this.biz_cloud_object_commit.retrieve({ commit_id: query.commit_id })
  //     if (success && data.length > 0) {
  //       await this.biz_cloud_object.updateReleaseId(query)
  //       ctx.body = Response.Success('发布成功');
  //     } else if (success && data.length === 0)  {
  //       ctx.body = Response.NotSuccess('没找到代码包，请重新上传');
  //     } else {
  //       ctx.body = Response.Error(error);
  //     }
  //   } else {
  //     ctx.body = Response.NotSuccess('参数错误');
  //   }
  // }


  @Get('commit')
  async commit(ctx: Context) {
    const query = ctx.query as AddCloudObjectCommit;
    const result = this.utils.typeValidator(query, 'AddCloudObjectCommit');

    if (!result?.valid) {
      ctx.body = Response.NotSuccess('参数错误');
      return;
    }
    try {
      ctx.body = await this.biz_cloud_object_commit.create(query);
    } catch (e) {
      ctx.body = Response.Error(e);
    }
  }

  @Get('query_commit')
  async query_commit(ctx: Context) {
    const query = ctx.query as QueryCloudObjectCommit;
    const result = this.utils.typeValidator(query, 'QueryCloudObjectCommit');
    if (result?.valid) {
      ctx.body = await this.biz_cloud_object_commit.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('update_commit')
  async update_commit(ctx: Context) {
    const query = ctx.query as UpdateCloudObjectCommit;
    const result = this.utils.typeValidator(query, 'UpdateCloudObjectCommit');
    if (result?.valid) {
      ctx.body = await this.biz_cloud_object_commit.update(query)
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

}

// @Controller('/cloud/component')
// class ComponentCDN extends WidgetApi {
//   CDN = 'https://obj.pipi.cn/festatic/ui-cloud-staging';

//   @Get(':component_name/:version')
//   async manifest(ctx: Context) {
//     const { component_name, version = '' } = ctx.params;
//     const s = process.uptime();
//     const { success, data } = await this.biz_widget.retrieve({
//       component_name,
//     }, true);
//     if (success && data) {
//       ctx.set({
//         'Content-Type': 'application/javascript',
//         'Content-Encoding': 'gzip'
//       });
//       const gzip = createGzip();

//       ctx.body = superagent.get(
//         `${this.CDN}/${
//           (data as ModelInstance['component']).latest_release_id
//         }/manifest.js`,
//       ).pipe(gzip)
//     }
//   }

//   @Get('static/:file+')
//   async cdn(ctx: Context) {
//     const { file } = ctx.params;
//     ctx.body = {
//       file,
//     };
//   }
// }

export { WidgetApi };
