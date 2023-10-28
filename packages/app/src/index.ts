import { createServer } from '@tomrpc/core';
import mount from '@tomrpc/mount';
import debug from 'debug';

import { loadBuildinMiddlewaire, loadCustomMiddlewaire } from './load';

const log = debug('@tomrpc/mount');

// {
//   name:'hi'
//   base: import.meta.url
//   static: 'public'
//   cors: { enable: true }
//   view: { enable: true }
//   jwt: { enable: true }
//   port: 3000
//   mount: './fn'
//   lifeCyle: {

//   },
//   debug: true
//   logLevel:
// }
interface IServe {
  enable?: boolean | false;
  root: string;
  opts: object;
}
interface IConfig {
  name: string | 'tomapp';
  base?: string;
  port?: number | 3000;
  debug?: boolean | false;
  mount?: string;
  buildin: {
    serve?: IServe;
    cors?: { enable: true };
    view?: { enable: true };
    jwt?: { enable: true };
  };
}

export async function createApp(cfg: IConfig) {
  const rpc = createServer(
    Object.assign(
      {
        base: import.meta.url,
        beforeOne: function (ctx: any, key: string) {
          console.log(ctx.path);
          console.log(ctx.method);
          console.log('beforeOne key=' + key);
        },
      },
      cfg
    )
  );

  await loadBuildinMiddlewaire(rpc);

  // rpc[load].push([someMw])
  // mount with lifecycle

  // await loadCustomMiddlewaire(rpc);

  // console.dir(mount);
  // if (cfg.mount) {
  //   rpc.base = import.meta.url;
  //   // await mount(rpc, './fn');
  // }

  return Object.assign(rpc, {
    start: function () {
      if (cfg.debug) {
        rpc.dump();
      }
      rpc.listen(cfg.port);
    },
  });
}
