/* @ts-ignore */
import { createServer } from '@tomrpc/core';
// import mount from '@tomrpc/mount';

(async () => {
  const rpc = createServer({
    base: import.meta.url,
  });

  rpc.fn('getUsers', function (a: string) {
    return {
      a: a,
      msg: 'getUsers',
    };
  });

  rpc.fn('postUsers', function (a: string) {
    return {
      a: a,
      msg: 'postUsers',
    };
  });

  rpc.fn('a', (a: string) => {
    return a;
  });

  rpc.fn('a.a', (a: string, ctx: any) => {
    // console.dir(ctx);
    if (ctx.method === 'POST') {
      console.dir('post');
      return {
        a: a,
        // b: b,
      };
    } else {
      console.dir('get' + ctx.method);
      return a;
    }
  });

  rpc.fn('b', () => {
    console.dir('test b');
  });

  rpc.add({
    c: (a: string) => {
      return a;
    },
    a: function (a: string, b: string) {
      return `${this.path} , ${a} c2 ${b}`;
    },
  });

  // console.dir(mount);
  rpc.base = import.meta.url;
  // await mount(rpc, './fn');

  // https://bobbyhadz.com/blog/typescript-no-overload-matches-this-call
  // rpc.dump();
  // console.dir(rpc.dump());

  // rpc.mount();

  rpc.start(3000);
})();
