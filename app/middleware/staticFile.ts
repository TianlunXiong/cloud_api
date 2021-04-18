import { Context, Next } from '@vikit/xnestjs';
import send from 'koa-send';
import path from 'path';

const dist = path.resolve(process.cwd(), '../../../dist/app/component-site');

const CACHE_TIME = 3600 * 1000 * 6;

async function staticFile (ctx: Context, next: Next) {
  await send(ctx, ctx.path, { root: dist, index: 'index.html', maxage: CACHE_TIME }).catch(() => {})
  await next();
}

export default staticFile;
