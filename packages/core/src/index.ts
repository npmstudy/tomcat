import { bodyParser } from '@koa/bodyparser';
import debug from 'debug';
import Koa from 'koa';

import { mountMiddleware } from './core';
import { isArrowFunction } from './utils';

export const lib = () => 'lib';

const log = debug('httprpc');

export function httprpc(config?: any) {
  const app = new Koa();

  app.use(bodyParser());

  // console.log(config);
  // console.log(app);

  return Object.assign(this, {
    rpcFunctions: {},
    app: app,
    use: app.use,
    _mounted: false,
    listen: function (port?: number) {
      this.mount();
      this.app.listen(port || 3000);
    },
    add: function (items) {
      for (const [name, fn] of Object.entries(items)) {
        if (isArrowFunction(fn)) {
          console.log(
            `this.rpcFunctions[${name}] is arrow function, please use ctx as param, not this`
          );
        }
        if (this.rpcFunctions[name]) {
          // console.log(`add ${name}: ${fn}`);
          console.log(`this.rpcFunctions[${name}] exisit`);
        }

        this.rpcFunctions[name] = fn;
      }
    },
    mount: function () {
      log('mount');

      if (!this._mounted) {
        app.use(mountMiddleware(this.rpcFunctions));
        this._mounted = true;
      }
    },
    dump: function (): void {
      for (const [name, fn] of Object.entries(this.rpcFunctions)) {
        console.log(`${name}: ${fn}`);
      }
    },

    fn: function (name: string, fn: any) {
      this.rpcFunctions[name] = fn;
    },
  });
}
