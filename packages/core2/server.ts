import { bodyParser } from '@koa/bodyparser';
import debug from 'debug';
import Koa from 'koa';
import compose from 'koa-compose';
const log = debug('@tomrpc/core2');
import mount from 'koa-mount';

import Fn from './fn';

export const LifeCycleConfig = {
  hooks: {
    init: [],
    before: [],
    load: [],
    beforeMount: [],
    afterMount: [],
    after: [],
    default: async (ctx, next) => {
      log('default');
      ctx.body = 'no middleware repsonse, please check your route';
      log('default end');
    },
  },
  init: async (server) => {
    console.dir('init s');
    // console.dir(server);
    const app = server.app;
    const loadMiddlewares = server.config.hooks.init;
    console.dir(loadMiddlewares);
    loadMiddlewares.forEach((mw) => {
      const m = async (ctx, next) => {
        await next();
      };
      console.dir(m + '');
      console.dir(mw + '');
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
    console.log('load Middlewares');
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

export default class RpcServer {
  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private plugins: Strategy[] = [];
  app;
  use;
  config;
  init: [];
  load: [];
  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(cfg) {
    // init
    this.config = Object.assign(LifeCycleConfig, cfg);
    this.app = new Koa();
    this.app.use(bodyParser());
    this.use = this.app.use;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public plugin(strategy: Strategy) {
    this.plugins.push(strategy);
  }

  public mount() {
    console.dir('mount');
    // hooks
    for (const plugin of this.plugins) {
      if (plugin.init.length > 0) this.config.hooks.init.push(...plugin.init);

      console.dir(plugin);
      console.dir(this.config.hooks.init);
    }

    this.config.init(this);

    for (const plugin of this.plugins) {
      if (plugin.load.length > 0) this.config.hooks.load.push(...plugin.load);
      console.dir('load plugin');
      console.dir(plugin.load);
      console.dir('load end plugin');
      console.dir(this.config.hooks.init);
    }

    this.config.load(this);

    // mount app
    for (const plugin of this.plugins) {
      console.dir('plugin.proxy() ' + plugin.prefix);
      console.dir(plugin.proxy());
      // this.app.use(compose([plugin.proxy(), mount(plugin.prefix, plugin.app)]));
      this.app.use(mount(plugin.prefix, plugin.app));
    }

    // 兜底的else

    this.app.use(this.config.hooks.default);
    // this.app.use(async (ctx, next) => {
    //   console.dir(ctx.path);
    //   ctx.body = { 23: 23 };
    // });
  }

  /**
   * The Context delegates some work to the Strategy object instead of
   * implementing multiple versions of the algorithm on its own.
   */
  public start(port?: number): void {
    const _port = port || 3000;
    console.dir(_port);

    // this.config.load(this);

    // this.config.beforeMount(this);
    this.mount();

    // this.config.afterMount(this);
    // this.config.after(this);
    // this.app.use(this.config.afterAll);

    this.app.listen(_port, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Koa app listening on ' + _port);
      }
    });
  }
}

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
export interface Strategy {
  init: any[];
  load: any[];
  prefix;
  app;
  proxy;

  // doAlgorithm(data: string[]): string[];
}

// /**
//  * Concrete Strategies implement the algorithm while following the base Strategy
//  * interface. The interface makes them interchangeable in the Context.
//  */
// class ConcreteStrategyA implements Strategy {
//   public doAlgorithm(data: string[]): string[] {
//     return data.sort();
//   }
// }

// class ConcreteStrategyB implements Strategy {
//   public doAlgorithm(data: string[]): string[] {
//     return data.reverse();
//   }
// }

// // console.log('Client: Strategy is set to normal sorting.');
// // context.start();

// // console.log('');

// // console.log('Client: Strategy is set to reverse sorting.');
// // context.plugin(new ConcreteStrategyB());
// // context.start();
