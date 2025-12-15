Function.prototype.myCall = function (context, ...args) {
  context =
    context === null || context === undefined ? window : Object(context);

  const fnKey = Symbol("key");
  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];
  return result;
};

Function.prototype.myApply = function (context, args) {
  context =
    context === null || context === undefined ? window : Object(context);

  const fnKey = Symbol("key");
  context[fnKey] = this;

  let result;
  if (args) {
    if (!Array.isArray(args) && !args.length) {
      throw new TypeError("CreateListFromArrayLike called on non-object");
    }
    result = context[fnKey](...args);
  } else {
    result = context[fnKey]();
  }
  delete context[fnKey];
  return result;
};

function mySelf(age) {
  console.log(`${this.name},${age}`);
}

const obj = {
  name: "aaa",
};

mySelf.myCall(obj, 10);
mySelf.myApply(obj, [10]);
