export const isArrowFunction = (func) => {
  if (typeof func === 'function') {
    const source = func.toString();
    return /^\([^)]*\)\s*=>/.test(source);
  }
  return false;
};

export function getHttpMethods() {
  return [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect',
  ];
}