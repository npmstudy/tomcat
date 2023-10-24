import { httprpc } from '@httprpc/core';

const rpc = httprpc({});

rpc.fn('a', (a: string) => {
  return a;
});

rpc.fn('a.a', (a: string, b: string, ctx: any) => {
  if (ctx.method === 'POST') {
    console.dir('post');
    return {
      a: a,
      b: b,
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

// https://bobbyhadz.com/blog/typescript-no-overload-matches-this-call
// rpc.dump();
// console.dir(rpc.dump());

// rpc.mount();

rpc.listen(3000);
