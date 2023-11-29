import supertest from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { TestProxy, TestProxy2 } from '../../proxy';
import { createServer } from '../index';

describe('proxy', async () => {
  it('should enable proxy1', async () => {
    const rpc = createServer({
      fn: {
        // prefix: '/apk2',
      },
    });

    rpc.fn('/a', function (a) {
      return { a: a };
    });

    const tp = new TestProxy({});

    rpc.plugin(tp);

    const request = supertest(rpc.callback());

    const spy = vi.spyOn(console, 'dir');
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });

    expect(spy).toHaveBeenCalled();
  });

  it('should enable proxy2', async () => {
    const rpc = createServer({
      fn: {
        // prefix: '/apk2',
      },
    });

    rpc.fn('/a', function (a) {
      return { a: a };
    });

    const tp = new TestProxy2({});

    rpc.plugin(tp);

    const request = supertest(rpc.callback());

    const spy = vi.spyOn(console, 'dir');
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });

    expect(spy).toHaveBeenCalled();
  });
});
