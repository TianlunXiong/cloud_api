import { Context, Next } from '@vikit/xnestjs';

async function cors(ctx: Context, next: Next) {
  if (ctx.headers.origin) {
    ctx.response.set({
      'Access-Control-Allow-Origin': ctx.headers.origin,
      'Access-Control-Allow-Credentials': 'true'
    })
  }
  await next();
}

export default cors;