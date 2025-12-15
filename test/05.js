class myPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "reject";

  constructor(executor) {
    this.state = myPromise.PENDING;
    this.result = null;
    this.callbacks = [];

    const resovle = (value) => {
      if (this.state === myPromise.PENDING) {
        this.state = myPromise.FULFILLED;
        this.result = value;
        this.callbacks.forEach((cb) => cb.onFulfilled(value));
      }
    };

    const reject = (error) => {
      if (this.state === myPromise.PENDING) {
        this.state = myPromise.REJECTED;
        this.result = error;
        this.callbacks.forEach((cb) => cb.onRejected(error));
      }
    };

    try {
      executor(resovle, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new myPromise((resolve, reject) => {
      const handle = (callback) => {
        setTimeout(() => {
          try {
            const x = callback(this.result);
            if (x instanceof myPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.state === myPromise.PENDING) {
        this.callbacks.push({
          onFulfilled: () => handle(onFulfilled),
          onRejected: () => handle(onRejected),
        });
      } else if (this.state === myPromise.FULFILLED) {
        handle(onFulfilled);
      } else if (this.state === myPromise.REJECTED) {
        handle(onRejected);
      }
    });
  }

  all(promises) {
    return new myPromise((resolve, reject) => {
      const total = promises.length;
      const result = [];
      let index = 0;
      promises.forEach((promise, i) => {
        myPromise.resolve(promise).then(
          (value) => {
            result[i] = value;
            index++;
            if (index === total) {
              resolve(result);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach((p) => {
        myPromise.resolve(p).then(
          (value) => resolve(value),
          (reason) => reject(reason)
        );
      });
    });
  }

  allSettled(promises) {
    return new myPromise((resolve, _) => {
      const result = [];
      let count = 0;
      const total = promises.length;
      promises.forEach(
        (p, index) => {
          myPromise.resolve(p).then((value) => {
            result[index] = {
              status: "fulfilled",
              value: value,
            };
            count++;
            if (count === total) resolve(result);
          });
        },
        (reason) => {
          result[index] = {
            status: "reject",
            reason: reason,
          };
          count++;
          if (count === total) resolve(result);
        }
      );
    });
  }

  static any(promises) {
    return new myPromise((resolve, reject) => {
      const errors = [];
      let count = 0;
      const total = promises.length;
      promises.forEach((p, index) => {
        myPromise.resolve(p).then(
          (value) => resolve(value),
          (reason) => {
            errors[index] = reason;
            count++;
            if (count === total) {
              reject(new Error("AggregateError: All promises were rejected"));
            }
          }
        );
      });
    });
  }

  static resolve(value) {
    return new myPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new myPromise((_, reject) => reject(reason));
  }
}
