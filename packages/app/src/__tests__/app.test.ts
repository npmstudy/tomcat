import { join } from 'desm';
import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp, AppServer } from '../index';
const from = 15000;
const range = 100;
const port = from + ~~(Math.random() * range);

describe('app', async () => {
  const rpc: AppServer = createApp({
    name: 'tomapp',
    base: import.meta.url,
    port: 3001,
    debug: false,
    mount: './f',
    buildin: {
      serve: { enable: true, root: join(import.meta.url, '../..', 'public'), opts: {} },
      cors: { enable: true },
      // jwt: {
      // enable: true,
      // secret: 'shhhhhh',
      // debug: true,
      // getToken: () => {
      //   const token = jwt.sign({ foo: 'bar' }, 'bad');
      //   console.dir('token');
      //   console.dir(token);
      //   return token;
      // },
      // unless: { path: ['/view'] },
      // },
      view: {
        enable: true,
        root: join(import.meta.url, '../..', 'view'),
        opts: {
          map: {
            html: 'ejs',
          },
        },
      },
    },
  });

  rpc.fn('a', function (a) {
    // console.dir(rpc.fn);
    // console.dir(this);
    // this.render('user', { user: { name: 'alfred' } });
    return { a: a };
  });

  rpc.fn('/a', function (a) {
    return { a: a };
  });

  rpc.fn('/b', function (a) {
    if (this.method === 'POST') {
      return { a: a, method: 'post' };
    }
    if (this.method === 'GET') {
      return { a: a, method: 'get' };
    }
  });

  rpc.fn('com.yourcompany.a', function (a: string) {
    return { a: a };
  });

  rpc.fn('com.yourcompany.b', function (a: string) {
    return `${this.path} , ${a} `;
  });

  rpc.add({
    '/add': function (a: string) {
      return { a: a };
    },
  });

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

  const request = supertest(rpc.callback());

  it('should start === rpc.callback', async () => {
    const request2 = supertest(rpc.start(port));
    const res = await request2.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  it('should access /a', async () => {
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  it('should access /a.json', async () => {
    const res = await request.get('/a.json');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 123 });
  });

  it('should access /view', async () => {
    const res = await request.get('/view');
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);

    expect(res.text).toEqual(`\n  <h2>alfred</h2>\n\n123\n`);
  });

  it('should access no routers[key]', async () => {
    //  if (!['POST', 'PUT', 'PATCH'].includes(ctx.method) && !ctx.query.$p) {
    const res = await request.get('/api/a123');
    expect(res.type).toEqual('text/plain');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('not match $p param, no process');
  });

  it('should access no routers[key]', async () => {
    const res = await request.get('/api/a123?$p=["hello"]');
    expect(res.type).toEqual('text/plain');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('[fn plugin] no fn repsonse, please check your fn if exist');
  });

  it('should access /add', async () => {
    const res = await request.get('/api/add?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  it('should access GET /b', async () => {
    const res = await request.get('/api/b?$p=["hello1"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello1', method: 'get' });
  });

  it('should access POST /b', async () => {
    const res = await request.post('/api/b').send(['hello']).set('Accept', 'application/json');

    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello', method: 'post' });
  });

  it('should access com.yourcompany.b', async () => {
    const res = await request.get('/api/com/yourcompany/b?$p=["hello"]');
    expect(res.type).toEqual('text/plain');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('/com/yourcompany/b , hello ');
  });
});
