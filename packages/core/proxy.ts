import { Proxy } from './src/proxy';
export class TestProxy extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'init';
    this.config.proxy.before = ['fn'];
  }
  proxy() {
    return async (ctx, next) => {
      console.dir('TestProxy process child' + ctx.path);
      await next();
    };
  }
}

export class TestProxy2 extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'before';
    this.config.proxy.before = ['fn'];
  }
  proxy() {
    return async (ctx, next) => {
      console.dir('TestProxy process child' + ctx.path);
      await next();
    };
  }
}
