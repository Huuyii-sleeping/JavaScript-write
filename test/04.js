function flat1(arr) {
  let result = [];

  function flatten(list) {
    for (let i = 0; i < list.length; i++) {
      if (Array.isArray(list[i])) {
        flatten(list[i]);
      } else {
        result.push(list[i]);
      }
    }
  }
  flatten(arr);
  return result;
}

function flat2(arr) {
  return arr.flat(Infinity);
}

function flat3(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

function flat4(arr) {
  const str = arr.toString().split(",").map(Number);
  return str;
}

function flat5(arr) {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flat5(cur) : cur);
  }, []);
}

let arr = [1, 2, [3, 4], 5, 5, 6, 8, 6, [7, 8, [9, 10]]];
console.log(flat5(arr));
