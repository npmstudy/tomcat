import debug from 'debug';

import mount from './mount';
import { isFunction } from './utils';

const log = debug('@tomrpc/mount');

// {a:{a:1, b:2}}
// {a.b:2, a.a:1}
// a.b => /a/b + function

export default async (rpc, dir) => {
  const files = await mount(rpc.base, dir);

  log(files);

  Object.keys(files).forEach((key) => {
    if (isFunction(files[key])) {
      log('add funtion key=' + key);
      rpc.fn(key, files[key]);
    } else {
      console.dir(`key=${key} is not a function`);
    }
  });
};
