# Tomcat

[![npm](https://img.shields.io/npm/v/@tomrpc/core.svg)](https://www.npmjs.com/package/@tomrpc/core)  [![Node.js CI](https://github.com/npmstudy/tomcat/actions/workflows/ci.yml/badge.svg)](https://github.com/npmstudy/tomcat/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/npmstudy/tomcat/graph/badge.svg?token=JKAAY92RBH)](https://codecov.io/gh/npmstudy/tomcat)

> Build function-based API with minimal code

- Basic
  - @tomrpc/core 最核心的函数机制
  - @tomrpc/client 客户端，支持Node.js和浏览器
- Advance
  - @tomrpc/mount 自动加载某目录下面的所有文件，如果export的是函数，则通过rpc.fn加入。
- Application（Todo）
  - @tomrpc/app 组合core和mount，增加内置中间件、环境判断等，用于应用创建。
  - 内置cors、serve、view、jwt中间件


# Usage

Server 函数，app.js

```js
import { createServer } from '@tomrpc/core';

const rpc = createServer({
  fn: {
    // prefix: '/apk2',
  },
});

rpc.fn('/a', function (a) {
  return { a: a };
});

rpc.start(2091);

```

execute app.js and start server with port 2091

```
$ node app.js
```

Client client.js


```js
import { createClient } from '@tomrpc/client'

const client = createClient({
  host: '127.0.0.1',
  port: 3000,
  namespace: '',
});
const res = await client.a('hello');
console.dir(res);
```

实际上，执行

```
http://127.0.0.1:3000/api/a?$p=[%22hello%22]
```

返回的结果

```js
{a: 'hello'}
```

## 定义函数

```js
rpc.fn('a', function (a: string) {
  return { a: a };
});
```

## 命名空间

server

```js
rpc.fn('com.yourcompony.a', function (a: string) {
  return a;
});
```

client

```js
import { createClient } from '@tomrpc/client';

const client = createClient({
  host: '127.0.0.1',
  port: 3000,
  namespace: 'com.yourcompony',
});

const res = await client.a('hello');
console.dir(res);
```


## Context

this === koa ctx

```js
rpc.fn('com.yourcompany.a', function (a: string) {
  return return `${this.path} , ${a} `;
});
```

## 定制

server

```js
rpc.fn('com.yourcompany.a', function (a: string) {
  if (this.method === 'post'){
    return return `${this.path} , ${a} `;
  }
});
```

client

```js
import { createClient } from '@tomrpc/client';

const client = createClient({
  host: '127.0.0.1',
  port: 3000,
  namespace: 'com.yourcompany',
  methodFilter: function (lastKey: string) {
    if (lastKey === 'a') {
      return 'post';
    } else {
      return 'get';
    }
  },
});

const res = await client.a('hello');
console.dir(res);
```

## App

```js
import { join } from 'desm';
import { createApp } from '@tomrpc/app';

const rpc = createApp({
  name: 'tomapp',
  base: import.meta.url,
  port: 3001,
  debug: false,
  mount: './f',
  buildin: {
    serve: {
      enable: true, root: join(import.meta.url, '.', 'public'), opts: {}
    },
    cors: { enable: true },
    view: {
      enable: true,
      root: join(import.meta.url, '.', 'view'),
      opts: {
      map: {
        html: 'ejs',
      },
      },
    },
  },
});

rpc.fn('a', function (a) {
  return { a: a };
});

rpc.start();
```

## 生命周期

在core里，存在4个生命周期，每个都是middleware数组。

- init: []
- before: []
- load: []
- after: []
- default: Middlewaire

```js
import { createServer } from '@tomrpc/core';

const rpc = createServer({
  default: async (ctx) => {
    ctx.body = 'custom default'
  }
});

rpc.init.push(someMiddleware)
```


## License

MIT @ npmstudy
