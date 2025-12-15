function throttle(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setInterval(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

function throttle1(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}


function action(type) {
  const date = new Date();
  const time = `${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  console.log(`[${type}] 执行时间: ${time}`);
}

const runDebounce = debounce(() => action('debounce'), 1000)
const runThrottle = throttle(() => action('throttle'), 1000)

setInterval(() => runDebounce, 1000)