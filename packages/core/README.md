# @tomrpc/core

## create

```js
const rpc = createServer({
 ...
});

```


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

## 实现插件

```ts
import { Plugable } from './src/plugin';
export default class Fn extends Plugable {
  constructor(cfg?) {
    super(cfg);
    this.prefix = '/demo';
    this.name = 'demo';
    const a = this.a();

    this.use(a);
  }
  process() {
    return async (ctx, next) => {
      console.dir('process child');
      if (ctx.path === '/') {
        ctx.body = { '/': 23 };
      } else {
      // ctx.body = { '2323api': 23 };
        await next();
      }
    };
  }
  a() {
    return async (ctx, next) => {
      console.dir('a ' + ctx.path);
      await next();
    };
  }
}
```

生命周期

- before:[] 可变数组
  - init:[] 可变数组
  - load:[] 可变数组
  - mount(plugin.prefix, plugin.app) 默认行为，不可操作
    - pre（可选，返回值是 Koa 中间件）
    - process（可选，返回值是 Koa 中间件）
    - post（可选，返回值是 Koa 中间件）
  - config.hooks.default 可在server配置里覆写
- after:[] 可变数组

生命周期操作方法，在构造函数中，增加到对应的数组即可

- this.addInit(a);
- this.addLoad(b);

被mount的中间件，实际上执行的是compose([pre, process, post]);

> 在plugin构造函数里，执行了this.load.push(this.getMiddleware());

- pre（可选，返回值是Koa中间件）
- process（可选，返回值是Koa中间件）
- post（可选，返回值是Koa中间件）


## RpcServer


```js
const rpc = new RpcServer({});

const fn = new Fn({});

rpc.plugin(fn);

rpc.start(3000)
```
