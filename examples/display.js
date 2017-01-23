const matrixes = require("matrixes");

let A = matrixes.createMatrix("12 1 32, 123 4 22");
let B = matrixes.transpose(A);

console.log("Matrix A:");
matrixes.disp(A);
console.log("Matrix B:");
matrixes.disp(B);
