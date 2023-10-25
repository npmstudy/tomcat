import { bodyParser } from '@koa/bodyparser';
import debug from 'debug';
import Koa from 'koa';
import compose from 'koa-compose';

import { mountMiddleware } from './core';
import { isArrowFunction } from './utils';

export const lib = () => 'lib';

const log = debug('httprpc');

export const LifeCycleConfig = {
  beforeAll: async (ctx, next) => {
    log('beforeAll');
    await next();
    log('beforeAll end');
  },
  beforeEach: async (ctx, next) => {
    log('beforeEach');
    await next();
    log('beforeEach end');
  },
  afterEach: async (ctx, next) => {
    log('afterEach');
    await next();
    log('afterEach end');
  },
  afterAll: async (ctx, next) => {
    log('afterAll');
    await next();
    log('afterAll end');
  },
};

export function httprpc(config?: any) {
  const _cfg = Object.assign(LifeCycleConfig, config);
  const app = new Koa();

  app.use(_cfg.beforeAll);

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
      app.use(_cfg.afterAll);
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
        const mw = compose([_cfg.beforeEach, mountMiddleware(this.rpcFunctions), _cfg.afterEach]);
        app.use(mw);
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
