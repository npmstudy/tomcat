const toString = Object.prototype.toString;

export function isFunction(fn) {
  if (!fn) {
    return false;
  }
  const string = toString.call(fn);
  return (
    string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
      // IE8 and below
      (fn === window.setTimeout ||
        fn === window.alert ||
        fn === window.confirm ||
        fn === window.prompt))
  );
}
