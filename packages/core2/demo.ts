import Plugable from './src/base';
export default class Fn extends Plugable {
  // public name: string;

  constructor() {
    super();

    this.prefix = '/demo';
    // this.name = 'fn';

    const a = this.a();
    const b = this.b();
    console.dir(a + '');
    // this.addInit(a);
    // this.addInit(b);

    const c = this.c();
    // this.addLoad(c);
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

  c() {
    return async (ctx, next) => {
      console.dir('c ' + ctx.path);
      await next();
    };
  }
}
