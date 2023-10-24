# httprpc

看到 https://httpc.dev/ 的用法有一点意思，随便写写。

> Build function-based API with minimal code and end-to-end type safety

对比fetch，你需要关注http path、verb，query，但httpc不需要。

TO晔明，自己了解rpc原理。本质上，httpc就是基于http的rpc方式调用。

补一张图。

# 约定

## 方式1

> GET /call/path?$p=[ serialized-parameters ]

测试

> http://127.0.0.1:3000/a/a?$p=["hello"]

## 方式2

```
POST /call/path
Content-Type: application/json

[ serialized-parameters ]
```

cli

```
$ curl -H "Content-Type: application/json" -X POST -d '["22hello", "001"]'  http://127.0.0.1:3000/a/a
```

# 用法

函数写法

```
module.exports = function (p1,b){
    console.dir(this.path)
    console.dir(this.query)
    if (this.method === 'POST'){
        return "this is a post"
    }

    return `${p1}+${b}`
}
```

说明

- this是koa中间件的ctx
- 参数，是调用端决定的

返回json，直接返回object即可

```
module.exports = function (a, b) {
    return {
        a: a,
        b: b
    }
}
```

# 项目

## 启动

> npm start

## 测试

> npm test

# 写在最后

这是一个demo项目，特性足够了，其他自己改吧

# TODO

优雅的实现（by晔明）

1. 将最简单中间件单独发包
    1. 支持所有http verbs，使用methods包
1. 将文件即路由功能单独发包
1. 将koa-compose引入，对鉴权生命周期等提供定制功能
1. 改成ts + pnpm + changeset，把fetch client实现一下
1. 提供项目cli脚手架等


举例：增加jwt鉴权

确定

> app.use(jwt({ secret: 'shared-secret' }));

想想koa-compose

> const middleware = compose([ jwt({ secret: 'shared-secret' }) , router ])


> 将最简单中间件单独发包示例

```js
import { httprpc } from '@httprpc/core';
// import { mountdir } from '@httprpc/mountdir';
// console.dir(httprpc);
const rpc = httprpc({});

rpc.fn('a', (a: string) => {
  return a;
});

rpc.fn('a.a', (a: string) => {
  return a;
});

rpc.fn('b', () => {
  console.dir('test b');
});

rpc.add({
  c: (a: string) => {
    return a;
  },
  a: (a: string) => {
    return `${a} c2`;
  },
});

// https://bobbyhadz.com/blog/typescript-no-overload-matches-this-call
rpc.dump();
// console.dir(rpc.dump());

rpc.mount();

rpc.app.listen(3000);

```

client

```js
const client = require('@httprpc/client')('127.0.0.1','3000')

const result = client.call('com.xxx.yy', 'a', 'b')

console.log(result) // ab

```

