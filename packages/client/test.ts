import { createClient } from './src/index';

const main = async () => {
  const client = createClient({
    host: '127.0.0.1',
    port: 3000,
    namespace: 'a',
    methodFilter: function (lastKey: string) {
      if (lastKey === 'a') {
        return 'post';
      } else {
        return 'get';
      }
    },
  });
  const res = await client.a('hello');
  console.dir(res);

  // const b = await client.a('hello');
  // console.dir(b);
};

main();
