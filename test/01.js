function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('...'))
    }

    let result = [];
    let index = 0;
    const total = promises.length;
    promises.forEach((promise, i) =>
      Promise.resolve(promise)
        .then((value) => {
          result[i] = value;
          index++;
          if (index === total) {
            resolve(result);
          }
        })
        .catch((reason) => {
          reject(reason);
        })
    );
  });
}

const p1 = new Promise((resolve) => setTimeout(() => resolve("A"), 100));
const p2 = Promise.resolve("B");
const p3 = new Promise((resolve) => setTimeout(() => resolve("C"), 50));
const p4 = new Promise((_, reject) => setTimeout(() => reject("Error D"), 20));

// ---------------- 成功测试 ----------------
myPromiseAll([p1, p2, p3])
  .then((res) => {
    console.log("成功结果:", res); // 预期输出：['A', 'B', 'C'] (顺序保持一致)
  })
  .catch((err) => {
    console.error("不应失败:", err);
  });

// ---------------- 失败测试 (应立即返回 Error D) ----------------
myPromiseAll([p1, p4, p3])
  .then((res) => {
    console.log("不应成功:", res);
  })
  .catch((err) => {
    console.error("失败结果:", err); // 预期输出：'Error D'
  });
