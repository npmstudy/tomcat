import { createServer } from '@tomrpc/core';
import fetch from 'isomorphic-unfetch';
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
  rpc.fn('/text', function (a) {
    return a;
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

  it('should GET return json', async () => {
    rpc.start(30001);

    const client = createClient({
      host: '127.0.0.1',
      port: 30001,
    });

    // console.dir(client);
    const res1 = await client.a('hello', 'json');
    // const res1 = await req.json();

    expect(res1['a']).toBe('hello');

    const res = await fetch('http://127.0.0.1:30001/api/a?$p=["hello"]');
    const s = await res.json();
    // console.dir(s);
    expect(s['a']).toBe('hello');
  });

  it('should GET return text', async () => {
    rpc.start(30002);

    const client = createClient({
      host: '127.0.0.1',
      port: 30002,
    });

    // console.dir(client);
    const res1 = await client.text('hello', 'text');
    // const res1 = await req.json();
    console.dir(res1);

    expect(res1).toBe('hello');
  });

  it('should POST return json', async () => {
    rpc.start(30003);

    const client = createClient({
      host: '127.0.0.1',
      port: 30003,
      // namespace: 'a',
      methodFilter: function (lastKey: string) {
        if (lastKey === 'b') {
          return 'post';
        } else {
          return 'get';
        }
      },
    });

    // console.dir(client);
    const res1 = await client.b('hello');
    // const res1 = await req.json();
    console.dir(res1);

    expect(res1['a']).toBe('hello');
    expect(res1['method']).toBe('post');
  });
});
