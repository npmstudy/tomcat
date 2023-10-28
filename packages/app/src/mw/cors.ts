export const cors = {
  name: 'cors',
  lifeCycle: 'load',
  mw: async (ctx: any, next: any) => {
    await next();
  },
};
