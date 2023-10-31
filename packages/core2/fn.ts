import { F } from 'vitest/dist/reporters-5f784f42';

export class Fn {
  public name: string;
  public init: Array<Function>;
  public load: Array<Function>;

  constructor() {
    this.name = 'fn';
    this.init = [];
    this.load = [];
  }

  async render(ctx, next) {
    console.dir('');
    await next();
  }
}
