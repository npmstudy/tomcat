import Koa from 'koa';
import supertest from 'supertest';
import { describe, expect, it, vi } from 'vitest';

// import { TestProxy, TestProxy2 } from '../../proxy';
import { Fn } from '../index';

describe('app', async () => {
  it('init default', async () => {
    const fn = new Fn();
    expect(fn.name).toEqual('Fn');
    expect(fn.config.prefix).toEqual('/api');
  });

  it('should config prefix', async () => {
    const fn = new Fn({ prefix: '/apk' });
    expect(fn.config.prefix).toEqual('/apk');
  });

  it('use fn add a function', async () => {
    const fn = new Fn({ prefix: '/apk' });

    fn.fn('/a', function (a) {
      return { a: a };
    });
    const count = Object.keys(fn.config['functions']).length;
    expect(1).to.equal(count);
  });

  it('use add method add a function', async () => {
    const fn = new Fn({ prefix: '/apk' });

    fn.add({
      c: (a: string) => {
        return a;
      },
      a: function (a: string, b: string) {
        return `${this.path} , ${a} c2 ${b}`;
      },
    });

    const count = Object.keys(fn.config['functions']).length;
    expect(2).to.equal(count);
  });

  it('use default response', async () => {
    const fn = new Fn({ prefix: '/apk' });
    const app = new Koa();

    app.use(fn.default());
    const request = supertest(app.callback());

    const res = await request.get('/');
    expect(res.type).toEqual('text/plain');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('[fn plugin] no fn repsonse, please check your fn if exist');
  });

  it('use fn add a function', async () => {
    const fn = new Fn({ prefix: '/apk' });

    fn.fn('/a', function (a) {
      return { a: a };
    });

    const request = supertest(fn.app.callback());

    const res = await request.get('/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  // it('use fn add a get function', async () => {
  //   const fn = new Fn({ prefix: '/apk' });

  //   fn.fn('/postAbc', function (a) {
  //     return { a: a };
  //   });

  //   const request = supertest(fn.app.callback());

  //   const res = await request.post('/postAbc').send(['hello']).set('Accept', 'application/json');
  //   // console.dir(res);
  //   expect(res.type).toEqual('text/plain');
  //   expect(res.status).toEqual(200);
  //   expect(res.text).toEqual('process fn:Abclock , you need send lock request from client');
  // });

  it('use fn add a lock function', async () => {
    const fn = new Fn({ prefix: '/apk' });

    fn.fn('/getAbc', function (a) {
      return { a: a };
    });
    fn.fn('/Abclock', function (a) {
      return { a: a };
    });

    const request = supertest(fn.app.callback());

    const res = await request.get('/Abclock?$p=["hello"]');
    // console.dir(res);
    expect(res.type).toEqual('text/plain');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('process fn:Abclock , you need send lock request from client');
  });

  it('use fn add two function with the same path', async () => {
    const spy = vi.spyOn(console, 'log');
    const fn = new Fn({ prefix: '/apk' });

    fn.fn('/a', function (a) {
      return { a: a };
    });

    fn.add({
      '/a': function (a: string, b: string) {
        return `${this.path} , ${a} c2 ${b}`;
      },
    });

    expect(spy).toHaveBeenCalled();
  });

  it('use fn add arrow function', async () => {
    const spy = vi.spyOn(console, 'log');
    const fn = new Fn({ prefix: '/apk' });

    fn.fn('/a', (a) => {
      return { a: a };
    });

    fn.add({
      '/a': (a: string, b: string, ctx) => {
        return `${ctx.path} , ${a} c2 ${b}`;
      },
    });

    expect(spy).toHaveBeenCalled();
  });
});
