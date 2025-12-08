function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
// 闭包 函数引用了外部的变量，并将引用返回到外部

const a = createCounter();
console.log(a());
console.log(a());
const b = createCounter();
console.log(b());
