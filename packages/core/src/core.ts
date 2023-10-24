import debug from 'debug';
const log = debug('httprpc');

export function mountMiddleware(routers) {
  log(routers);
  return async (ctx, next) => {
    log('mountMiddleware');
    const key = ctx.path.replace('/', '').split('/').join('.');

    if (!['POST', 'PUT', 'PATCH'].includes(ctx.method) && !ctx.query.$p) {
      console.log('not match $p param, no process');
      await next();
    } else {
      const param = ctx.method === 'POST' ? ctx.request.body : JSON.parse(ctx.query.$p);

      log(key);
      log(param);

      if (routers[key]) {
        const args = [...param, ctx];
        // console.dir(args);
        const result = routers[key].apply(ctx, args);
        ctx.body = result;
      } else {
        const msg = JSON.stringify(ctx, null, 4);
        ctx.body = ` not match path ${ctx.path} \n ctx = ${msg}`;
      }
      await next();
    }
  };
}
