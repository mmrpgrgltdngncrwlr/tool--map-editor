let expensiveCall = function (data) {
  for (let i = 0; i < data.a; ++i) {}
  for (let i = 0; i < data.b; ++i) {}
  for (let i = 0; i < data.c; ++i) {}
  return 0;
};
import { $ifexists, $use } from './lib.js';
console.log(`The square of ${expensiveCall({ a: 1, b: 234, c: 5678 })} is`, expensiveCall({ a: 1, b: 234, c: 5678 }) * expensiveCall({ a: 1, b: 234, c: 5678 }));
const result = expensiveCall({ a: 1, b: 234, c: 5678 });
const squared = result * result;
console.log(`The square of ${result} is`, squared);
$use(expensiveCall({ a: 1, b: 234, c: 5678 }), (n) => console.log(`The square of ${n} is`, n * n));
$ifexists(null, (v) => console.log(v));
$ifexists(undefined, (v) => console.log(v));
$ifexists(0, (v) => console.log(v));
