
# @tomrpc/app


tom.json

```
{
  name:'hi'
  base: import.meta.url
  static: 'public'
  core: true
  view: true
  jwt: true
  port: 3000
  mount: './fn'
  lifeCyle: {

  },
  debug: true
  logLevel:
}
```


```js
import app from '@tomrpc/app';

const rpc = createServer(cfg);

rpc.start();

```

jwt豁免

```js
  rpc.jwt(async (ctx, next) => {
    // console.dir('view');
    await next();
    // if (['/', '/view', '/api*'].some((e) => ctx.path.match(e))) {
    //   await next();
    // } else {
    //   ctx.body = { jwt: 'not jwt' };
    // }
  });
```
