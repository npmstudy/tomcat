// const user = { name: 'John Doe', email: 'john@doe.com', age: 30 };

// const userProxy = new Proxy(user, {
//   get: (target, prop) => {
//     // intercept property access
//     console.log(`Getting property "${prop}"`);
//     target.name1 = function () {
//       return 2;
//     };
//     return target[prop];
//   },
// });

// console.dir(userProxy.name1());

// const user = {
//   name: 'John Doe',
//   email: 'john@doe.com',
//   age: 30,
//   setName(name) {
//     this.name = name;
//   },
//   setEmail(email) {
//     this.email = email;
//   },
// };

// console.log(user);

// const userProxy = new Proxy(user, {
//   get: (target, prop) => {
//     return target[prop];
//   },
//   apply: (target, thisArg, args) => {
//     // log method calls and their arguments
//     console.log(`Called method "${target.name}" with args:`, args);
//     return target.apply(thisArg, args);
//   },
// });

// // try calling the user object's methods
// userProxy.set1Name('Jane Doe'); // logs "Called method "setName" with args: ["Jane Doe"]"
// userProxy.setEmail('jane@doe.com'); // logs "Called method "setEmail" with args: ["jane@doe.com"]"

const handler = {
  get: function (target, prop, receiver) {
    // console.dir(prop);
    return function (...args) {
      console.dir(' - - - ');
      console.dir(target.namespace + '.' + prop);
      console.dir(args);
      return prop;
    };
  },
};

function createClient(namespace = 'default', config = {}) {
  const target = {};
  let p = {};
  const o = [];
  const fn = (item) => {
    o.push(o.length === 0 ? target : (o[o.length - 1][item] = {}));
    p = new Proxy(o[o.length - 1], handler);
  };

  namespace && fn(namespace) && namespace.split('.').forEach(fn);

  p.namespace = namespace && namespace.split('.') && namespace.split('.').pop();
  p.config = config;
  return p;
}

const proxy = createClient();
const proxy2 = createClient('abc.add');

console.log(proxy.add(2, 3));
console.log(proxy2.abc(1, 3));
