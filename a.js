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

const target = {
  sum: (a, b) => a + b,
};

const handler = {
  get: function (target, prop, receiver) {
    prop.split('.').forEach((element) => {
      console.dir(target);
      console.dir(element);
      target[element] = {};
      console.dir(target);
      // if (!target[element])console.dir(target[element]);
      new Proxy(target[element], handler);
    });

    return function () {
      //
      console.dir('return fn');
      console.dir(target);
      console.dir(prop);
      if (prop.split('.').length > 0) {
        target.add = {
          abc: {},
        };
        // console.dir(prop);
      }

      console.dir(receiver);

      // console.dir(arguments);
    };
  },
};

const proxy = new Proxy(target, handler);
// const proxy2 = new Proxy(proxy.add, handler);

console.log(proxy.add.abc(2, 3)); // Output: Calling function: sum, 5
