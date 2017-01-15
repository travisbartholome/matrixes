const matrixes = require('matrixes');

let A = matrixes.createMatrix('1 2 3, 4 5 6');
let B = matrixes.createMatrix('1 0 1, 0 1 0');

let sumAB = matrixes.add(A, B);

console.log(sumAB);
// => [ [2, 2, 4], [4, 6, 6] ]
