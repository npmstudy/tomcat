import importDir, { join } from '@tomrpc/import-dir';
import debug from 'debug';
import { flatten } from 'flat';

const log = debug('@tomrpc/mount');

// {a:{a:1, b:2}}
// {a.b:2, a.a:1}
// a.b => /a/b + function

export default async (base, dir) => {
  const files = await importDir(join(base, dir), {
    recurse: true,
    extensions: ['.ts', '.js', '.json'],
  });

  log(files);

  return flatten(files);
};
