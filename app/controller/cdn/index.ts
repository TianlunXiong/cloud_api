import { Context } from 'koa';
import { Controller, Get } from '@vikit/xnestjs';
import DB from '../../service/db';

const SECRET = '551C16C8D7F99B15F7167C62D8903AB1';
const SECRET_STAGING = '32ED0CAF21FA25864014914D04544122';

@Controller('/static')
class CDN_Pass {

  constructor(private db: DB){
  }

  @Get('cdn/secret')
  async secret(ctx: Context) {
    ctx.body = {
      success: true,
      data: SECRET,
    };
  }
  @Get('cdn/secret_staging')
  async secret_staging(ctx: Context) {
    ctx.body = {
      success: true,
      data: SECRET_STAGING,
    };
  }
}

export { CDN_Pass };
