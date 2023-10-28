import jsonwebtoken from 'jsonwebtoken';
export const init = async function (ctx, next) {
  ctx.jwt = jsonwebtoken;
  await next();
};
