
# @tomrpc/mount


```js
import mount from '@tomrpc/mount';


const rpc = createServer({
    base: import.meta.url,
    beforeOne: function (ctx: any, key: string) {
    console.log(ctx.path);
    console.log(ctx.method);
    console.log('beforeOne key=' + key);
  },
});

rpc.base = import.meta.url;
mount(rpc, './fn');

rpc.listen(3000);

```
