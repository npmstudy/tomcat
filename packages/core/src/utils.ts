export const isArrowFunction = (func) => {
  if (typeof func === 'function') {
    const source = func.toString();
    return /^\([^)]*\)\s*=>/.test(source);
  }
  return false;
};
