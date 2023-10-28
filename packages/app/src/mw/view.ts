export const view = {
  name: 'view',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
