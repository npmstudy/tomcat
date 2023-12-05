import { createServer } from '@tomrpc/core';
import fetch from 'isomorphic-unfetch';
// import fetch1 from 'isomorphic-unfetch';

// import { ofetch } from 'ofetch';
import { describe, expect, it } from 'vitest';

import { createClient } from '..';

describe('lib', () => {
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

  // const request = supertest(rpc.callback());

  it('should start === rpc.callback', async () => {
    rpc.start(30001);
    // const res = await request2.get('/api/a?$p=["hello"]');
    // expect(res.type).toEqual('application/json');
    // expect(res.status).toEqual(200);
    // expect(res.body).toEqual({ a: 'hello' });

    const client = createClient({
      host: '127.0.0.1',
      port: 30001,
      // namespace: 'a',
      // methodFilter: function (lastKey: string) {
      //   if (lastKey === 'a') {
      //     return 'post';
      //   } else {
      //     return 'get';
      //   }
      // },
    });

    console.dir(client);
    // const res1 = await client.a('hello');
    const res = await fetch('http://127.0.0.1:30001/api/a?$p=["hello"]');
    const s = await res.json();
    console.dir(s);
    // console.dir(res1);
    // const res = await client.postUsers('hello postUsers');
    // console.dir(res);
  });
  // it.only('should render lib', async () => {
  //   const res = await ofetch('https://jsonplaceholder.typicode.com/todos/1');
  //   console.dir(res);
  //   expect('lib').toBe('lib');
  // });
});
