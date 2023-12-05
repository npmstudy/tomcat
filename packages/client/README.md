# @tomrpc/client


## Usage

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

对应的Server函数

```js
rpc.fn('a', (a: string) => {
  return a;
});
```

## 返回类型

方法的第二个参数是返回类型，默认返回json。

返回json

```js
const res = await client.a('hello');
console.dir(res);

or

const res = await client.a('hello','json');
console.dir(res);

```

返回text，只有1种办法

```js
const res = await client.a('hello','text');
console.dir(res);
```


## 扩展

默认用 get 方法，如果想用 post，可以通过 methodFilter 来配置


```js
const client = createClient({
  host: '127.0.0.1',
  port: 3000,
  namespace: 'a',
  methodFilter: function (lastKey: string) {
    if (lastKey === 'a') {
      return 'post';
    } else {
      return 'get';
    }
  },
});
```

比如a.a，你的lastKey就是a，这里把namespace去掉，更简单。

## test

```
$ DEBUG=\* tsx packages/client/test.ts
```
