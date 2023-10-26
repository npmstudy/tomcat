import mount from './mount';

(async () => {
  const files = await mount(import.meta.url, './f');
  console.dir(files);
})();
