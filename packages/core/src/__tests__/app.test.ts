import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

// import { TestProxy, TestProxy2 } from '../../proxy';
import { createServer } from '../index';

describe('app', async () => {
  const rpc = createServer({
    fn: {
      // prefix: '/apk2',
    },
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

  const request = supertest(rpc.callback());

  it('should acess /a', async () => {
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  it('should acess GET /b', async () => {
    const res = await request.get('/api/b?$p=["hello1"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello1', method: 'get' });
  });

  it('should acess POST /b', async () => {
    const res = await request.post('/api/b').send(['hello']).set('Accept', 'application/json');

    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello', method: 'post' });
  });
});
