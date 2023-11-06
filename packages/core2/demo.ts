import { Plugable } from './src/plugin';
export default class Fn extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '/demo';
    this.name = 'demo';

    const a = this.a();
    const b = this.b();

    this.addInit(a);
    this.addInit(b);
  }
  process() {
    return async (ctx, next) => {
      console.dir('process child');
      if (ctx.path === '/') {
        ctx.body = { '/': 23 };
      } else {
        // ctx.body = { '2323api': 23 };
        await next();
      }
    };
  }

  a() {
    return async (ctx, next) => {
      console.dir('a ' + ctx.path);
      await next();
    };
  }
  b() {
    return async (ctx, next) => {
      console.dir('b ' + ctx.path);
      await next();
    };
  }
}
