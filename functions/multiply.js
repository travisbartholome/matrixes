const isValidMatrix = require('./isValidMatrix.js');

function matrixMult(A, B) {
  if (!isValidMatrix(A) || !isValidMatrix(B)) {
    throw new Error('Invalid matrix');
  }

  // Check if the matrices can be legally multiplied (mathematically speaking).
  if (A[0].length !== B.length) {
    throw new Error('Cannot multiply: matrices must be of sizes m x n and n x p to produce a valid answer');
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

module.exports = matrixMult;
