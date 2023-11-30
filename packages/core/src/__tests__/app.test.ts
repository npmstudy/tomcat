import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

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

  rpc.fn('com.yourcompany.a', function (a: string) {
    return { a: a };
  });

  rpc.fn('com.yourcompany.b', function (a: string) {
    return `${this.path} , ${a} `;
  });

  rpc.add({
    '/add': function (a: string, b: string) {
      return { a: a };
    },
  });

  const request = supertest(rpc.callback());

  it('should access /a', async () => {
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
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
