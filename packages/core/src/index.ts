import { bodyParser } from '@koa/bodyparser';
import debug from 'debug';
import Koa from 'koa';
import compose from 'koa-compose';

import { mountMiddleware } from './core';
import { isArrowFunction, getHttpMethods } from './utils';

export const lib = () => 'lib';

const log = debug('@tomrpc/core');

export const LifeCycleConfig = {
  hooks: {
    init: [],
    before: [],
    load: [],
    beforeMount: [],
    afterMount: [],
    after: [],
  },
  init: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.init;
    console.log(loadMiddlewares);
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  before: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.before;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  load: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.load;
    console.log(loadMiddlewares);
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  after: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.after;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  beforeMount: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.beforeMount;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  afterMount: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.afterMount;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
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
  beforeOne: function (ctx, key: string) {
    log('beforeOne key=' + key);
  },
  afterOne: function (ctx, key: string) {
    log('afterOne key=' + key);
  },
};

export const createServer = function (config?: any) {
  const _cfg = Object.assign(LifeCycleConfig, config);

  // 在app时用
  this.config = _cfg;
  this.base = _cfg.base;

  const app = new Koa();
  app.use(bodyParser());

  this.app = app;
  this.use = app.use;

  //
  app.use(_cfg.beforeAll);

  _cfg.before(this);

  return Object.assign(this, {
    rpcFunctions: {},
    _mounted: false,
    listen: function (port?: number) {
      _cfg.init(this);

      _cfg.load(this);

      _cfg.beforeMount(this);
      this.mount();
      _cfg.afterMount(this);
      _cfg.after(this);
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
          log(`add ${name}: ${fn}`);
          console.log(`this.rpcFunctions[${name}] exisit`);
        }

        this.rpcFunctions[name] = fn;
      }
    },
    mount: function () {
      log('mount');

      if (!this._mounted) {
        const mw = compose([
          _cfg.beforeEach,
          async (ctx, next) => {
            log('beforeOne');
            const key = ctx.path.replace('/', '').split('/').join('.');
            _cfg.beforeOne(ctx, key);

            console.dir(ctx.jwt);

            const lastKey = key.split('.').pop();
            const httpMethods = getHttpMethods();

            const supportMethods = [];
            httpMethods.forEach(function (m) {
              if (lastKey.indexOf(m) != -1) {
                log(m);
                supportMethods.push(m);
                return m;
              }
            });
            // console.log(supportMethods);

            if (supportMethods.length === 0) {
              log('没有匹配到包含get/post等方法的函数');
              await next();
            } else if (ctx.method === supportMethods[0]) {
              log('匹配到包含get/post等方法的函数');
              await next();
            } else {
              log('匹配到包含get/post等方法的函数，但method不对');
              ctx.body =
                'process fn:' +
                lastKey +
                ' , you need send ' +
                supportMethods[0] +
                ' request from client';
            }

            log('beforeOne end');
          },
          mountMiddleware(this.rpcFunctions),
          async (ctx, next) => {
            log('afterOne');
            const key = ctx.path.replace('/', '').split('/').join('.');
            _cfg.afterOne(ctx, key);
            await next();
            log('afterOne end');
          },
          _cfg.afterEach,
        ]);
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
};
