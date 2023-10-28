import { createApp } from './src/index';

(async () => {
  const rpc = await createApp({
    name: 'tomapp',
    base: import.meta.url,
    port: 3000,
    debug: false,
    // mount?: './fn'';
    buildin: {
      static: { enable: true },
    },
  });

  rpc.fn('a', function (a) {
    return a;
  });

  rpc.start();
})();
