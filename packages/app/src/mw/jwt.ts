export const jwt = {
  name: 'jwt',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
