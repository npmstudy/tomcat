import { dirname, filename, join } from 'desm';
import jwt from 'jsonwebtoken';

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
        unless: { path: ['/view'] },
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
  });

  // rpc.jwt(async (ctx, next) => {
  //   const secret = 'shhhhhh';
  //   const token = jwt.sign({ foo: 'bar' }, secret);
  //   console.dir(ctx.path);

  //   await next();
  //   // if (['/', '/view', '/api*'].some((e) => ctx.path.match(e))) {
  //   //   await next();
  //   // } else {
  //   //   ctx.body = { jwt: 'not jwt' };
  //   // }
  // });

  rpc.render('/view', async (ctx, next) => {
    console.dir('view');
    ctx.state = {
      session: ctx.session,
      title: 'app',
    };
    if (ctx.path === '/view') {
      await ctx.render('user.ejs', { user: { name: 'alfred' } });
    } else {
      await next();
    }
  });

  // rpc.view vs rpc.fn变成插件
  rpc.fn('a', function (a) {
    // console.dir(rpc.fn);
    // console.dir(this);
    // this.render('user', { user: { name: 'alfred' } });
    return { a: a };
  });

  // console.dir(rpc);

  rpc.start();
})();
