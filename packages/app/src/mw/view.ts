export const view = {
  name: '',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
