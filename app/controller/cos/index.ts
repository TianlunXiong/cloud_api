import { Context } from 'koa';
import { Controller, Get } from '@vikit/xnestjs';
import Cos from '../../service/cos';
import Utils from '../../service/utils';
import { CosKey } from '../../interface/api'

@Controller('/api/v1')
class CosApi {

  constructor(private cos: Cos, private utils: Utils){}

  @Get('cos/key')
  async key(ctx: Context) {
    const query = ctx.query as CosKey;
    if (this.utils.typeValidator(query, 'CosKey')?.valid && query.user === 'tainlx') {
      ctx.body = await this.cos.getCredential();
    } else {
      ctx.body = Utils.Response.NotSuccess('参数错误')
    }
  }
}

export { CosApi };
