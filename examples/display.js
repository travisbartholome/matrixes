const matrixes = require("../matrix.js");

let A = matrixes.createMatrix("12 1 32, 123 4 22");
let B = matrixes.transpose(A);
let C = matrixes.createMatrix("33, 14");

console.log("Matrix A:");
matrixes.disp(A);
console.log("Matrix B:");
matrixes.disp(B);
console.log("Matrix A augmented with C:");
matrixes.disp(A, C);
