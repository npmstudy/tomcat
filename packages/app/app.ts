import { dirname, filename, join } from 'desm';

import { createApp } from './src/index';

(async () => {
  const rpc = await createApp({
    name: 'tomapp',
    base: import.meta.url,
    port: 3001,
    debug: false,
    mount: './f',
    buildin: {
      serve: { enable: true, root: join(import.meta.url, '.', 'public'), opts: {} },
      cors: { enable: true },
      jwt: {
        enable: true,
        secret: 'shhhhhh',
        debug: true,
        unless: ['/public', '/a'],
      },
      view: {
        enable: true,
        root: join(import.meta.url, '.', 'view'),
        opts: {
          map: {
            html: 'ejs',
          },
        },
      },
    },
    beforeAll: async (ctx, next) => {
      // console.dir(ctx.jwt);
      await next();
    },
  });

  // rpc.view vs rpc.fn变成插件
  rpc.fn('a', function (a) {
    console.dir(this.render);
    // this.render('user', { user: { name: 'alfred' } });
    return { a: a };
  });

  rpc.start();
})();
