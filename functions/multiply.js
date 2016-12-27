// Pulling in other matrix functions.
const isRectangular = require("./isRectangular.js");

function matrixMult(A, B) {
  // Check if the matrices are both rectangular.
  if (!isRectangular(A) || !isRectangular(B)) {
    throw new Error("Both matrices must be rectangular.");
  }

  // Check if the matrices can be multiplied.
  if (A[0].length !== B.length) {
    throw new Error("Cannot multiply these matrices. Matrices must be of sizes m x n and n x p to produce a valid answer.");
  }

  // Multiply matrices.
  let result = [];
  let row, entry;
  for (let k = 0; k < A.length; k++) {
    row = [];
    for (let j = 0; j < B[0].length; j++) {
      entry = 0;
      for (let i = 0; i < A[0].length; i++) {
        entry += A[k][i] * B[i][j];
      }
      row.push(entry);
    }
    result.push(row);
  }
  return result;
}

/*const inputOne = process.argv[2];
const inputTwo = process.argv[3];

let matrixOne = Parser.createMatrix(inputOne);
let matrixTwo = Parser.createMatrix(inputTwo);*/

//console.log(matrixOne);

//console.log(matrixMult(matrixOne, matrixTwo));

module.exports = matrixMult;
