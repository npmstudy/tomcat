export const lib = () => 'lib';

import debug from 'debug';
import flatten from 'flat';
import requireDir from 'require-dir';

const log = debug('httprpc:mountdir');
// {a:{a:1, b:2}}
// {a.b:2, a.a:1}
// a.b => /a/b + function

export function mountdir(dir) {
  const files = requireDir(dir, {
    recurse: true,
    extensions: ['.js', '.json'],
  });

  log(files);

  return flatten(files);
}
