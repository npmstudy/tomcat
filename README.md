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


## License

MIT @ npmstudy
