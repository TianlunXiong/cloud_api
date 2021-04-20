import { Context } from 'koa';
import { Controller, Get } from '@vikit/xnestjs';
import { Biz_Widget, Biz_Widget_Commit } from '../../service/biz';
import Utils from '../../service/utils';
import { AddWidget, AddWidgetCommit, DeleteWidget, QueryWidget, QueryWidgetCommit } from '../../interface/api';

const Response = Utils.Response;

@Controller('/api/v1/widget')
class WidgetApi {
  constructor(
    private utils: Utils,
    private biz_widget: Biz_Widget,
    private biz_widget_commit: Biz_Widget_Commit,
  ) {}

  @Get('add')
  async add(ctx: Context) {
    const query = ctx.query as AddWidget;
    const result = this.utils.typeValidator(query, 'AddWidget')
    if (result?.valid) {
      ctx.body = await this.biz_widget.create(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('delete')
  async delete(ctx: Context) {
    const query = ctx.query as DeleteWidget;
    const result = this.utils.typeValidator(query, 'DeleteWidget');
    if (result?.valid) {
      ctx.body = await this.biz_widget.delete(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('query')
  async query(ctx: Context) {
    const query = ctx.query as QueryWidget;
    const result = this.utils.typeValidator(query, 'QueryWidget');
    if (result?.valid) {
      ctx.body = await this.biz_widget.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('query_commit')
  async query_commit(ctx: Context) {
    const query = ctx.query as QueryWidgetCommit;
    const result = this.utils.typeValidator(query, 'QueryWidgetCommit');
    if (result?.valid) {
      ctx.body = await this.biz_widget_commit.retrieve(query);
    } else {
      ctx.body = Response.NotSuccess('参数错误');
    }
  }

  @Get('commit')
  async commit(ctx: Context) {
    const query = ctx.query as AddWidgetCommit;
    const result = this.utils.typeValidator(query, 'AddWidgetCommit');

    if (!result?.valid) {
      ctx.body = Response.NotSuccess('参数错误');
      return;
    }
    try {
      ctx.body = await this.biz_widget_commit.create(query);
    } catch (e) {
      ctx.body = Response.Error(e);
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
