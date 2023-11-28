import supertest from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';

import { TestProxy, TestProxy2 } from '../../proxy';
import { createServer } from '../index';
// import { RpcServer } from './src/server';

// const rpc = new RpcServer({});
const rpc = createServer({
  fn: {
    // prefix: '/apk2',
  },
});

rpc.fn('/a', function (a) {
  return { a: a };
});
// import mount from '../mount';

// beforeAll(async () => {
//   // called once before all tests run
//   await startMocking();

//   // clean up function, called once after all tests run
//   return async () => {
//     await stopMocking();
//   };
// });

rpc.prepare();

const request = supertest(rpc.callback());

describe('app', async () => {
  it('should first app', async () => {
    const res = await request.get('/api/a?$p=["hello"]');
    expect(res.type).toEqual('application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ a: 'hello' });
  });

  it('should render lib', () => {
    expect('lib').toBe('lib');
  });
});
