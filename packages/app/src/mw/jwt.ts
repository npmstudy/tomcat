export const jwt = {
  name: '',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
