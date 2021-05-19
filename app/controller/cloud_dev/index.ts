import { Context } from 'koa';
import { Controller, Get } from '@vikit/xnestjs';
import WSP from '../../service/wsproxy';
import Utils from '../../service/utils';

@Controller('/api/v1')
export class CloudDev {

  constructor(private utils: Utils, private wsp: WSP){}

  @Get('cloud_dev/useronline')
  async useronline(ctx: Context) {
    ctx.body = WSP.ShowAllWs();
  }

  @Get('cloud_dev/connection/:paths+')
  async devProxy(ctx: Context) {
    const paths = ctx.params.paths;
    const slashPos = paths.indexOf('/')
    const user = paths.slice(0, slashPos);
    const path = paths.slice(slashPos);
    const ws = WSP.ws_conn[user];
    ctx.type = 'application/javascript'
    if (ws) {
      const r = await WSP.fetchPath(ws, path);
      ctx.body = r;
    } else {
      ctx.body = "console.error('INVALID USER')"
    }
  }
}
