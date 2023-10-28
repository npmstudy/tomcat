export const serve = {
  name: '',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
