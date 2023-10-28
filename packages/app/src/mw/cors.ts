export const cors = {
  name: '',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
