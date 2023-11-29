import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

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
});
