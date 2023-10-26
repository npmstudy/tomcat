export const lib = () => 'lib';
import importDir from '@tomrpc/import-dir';
import debug from 'debug';
import { flatten } from 'flat';

const log = debug('@tomrpc/mount');

// {a:{a:1, b:2}}
// {a.b:2, a.a:1}
// a.b => /a/b + function

export default async (dir) => {
  const files = await importDir(dir, {
    recurse: true,
    extensions: ['.js', '.json'],
  });

  console.log(files);

  return flatten(files);
};
