# Tomcat

> Build function-based API with minimal code

# Usage

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
http://127.0.0.1:3000/a?$p=[%22hello%22]
```

对应的 Server 函数

```js
rpc.fn('a', function (a: string) {
  return a;
});
```

## 定义函数

```js
rpc.fn('a', function (a: string) {
  return a;
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
rpc.fn('com.yourcompony.a', function (a: string) {
  return return `${this.path} , ${a} `;
});
```

## 定制

server

```js
rpc.fn('com.yourcompony.a', function (a: string) {
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
  namespace: 'com.yourcompony',
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

稍后会通过com.yourcompony.getXXXX或com.yourcompony.postXXXX实现。

## 生命周期

- beforeAll（中间件）
  - beforeEach（中间件）
    - beforeOne（普通函数）
      - 函数执行
    - afterOne（普通函数）
  - afterEach（中间件）
- afterAll（中间件）


```js
import { createServer } from '@tomrpc/core';

const rpc = createServer({
  beforeOne: function (ctx: any, key: string) {
    console.log(ctx.path);
    console.log(ctx.method);
    console.log('beforeOne key=' + key);
  },
});
```


## License

MIT @ npmstudy
