# @tomrpc/core

## create

```js
const rpc = createServer({
  beforeOne: function (ctx: any, key: string) {
    console.log(ctx.path);
    console.log(ctx.method);
    console.log('beforeOne key=' + key);
  },
});

```

## lifecyle

- beforeAll（中间件）
  - beforeEach（中间件）
    - beforeOne（普通函数）
      - 函数执行
    - afterOne（普通函数）
  - afterEach（中间件）
- afterAll（中间件）

## example

```js
import { createServer } from '@tomrpc/core';

const rpc = createServer({
  beforeOne: function (ctx: any, key: string) {
    console.log(ctx.path);
    console.log(ctx.method);
    console.log('beforeOne key=' + key);
  },
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

// https://bobbyhadz.com/blog/typescript-no-overload-matches-this-call
// rpc.dump();
// console.dir(rpc.dump());

// rpc.mount();

rpc.start(3000);
```


const app = new Koa()


const app1 = new Koa()
const app2 = new Koa()
const app3 = new Koa()

app.mount(app1.prefix,fn)
app.mount(app2.prefix,view)
app.mount(app3.prefix,static)

=>

const app = new Koa()



app.plugin({
  prefix,
  fn
})

return fn={
  name='fn'
  init:[],
  load:[]

}
app.plugin(app2.prefix,view)
app.plugin(app3.prefix,static)
