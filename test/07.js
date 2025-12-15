function* myGenerator() {
  console.log("开始执行");
  const res = yield Promise.resolve("Success Data");
  console.log(res);
  return "Done";
}

function run(genFn) {
  const iterator = genFn();
  // 参数会当作上一个yeild表达式的返回值
  function autoNext(data) {
    const { value, done } = iterator.next(data);
    if (done) {
      return Promise.resolve(value);
    }

    // 进行包装 防止是普通值，导致失去链式调用
    return Promise.resolve(value).then(
      (res) => {
        // 进行递归调用
        autoNext(res);
      },
      (err) => {
        iterator.throw(err);
      }
    );
  }
  return autoNext();
}

run(myGenerator);
