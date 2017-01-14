const isValidMatrix = require('./isValidMatrix.js');

function multiply(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error('Invalid matrix');
  }

  // Check if the matrices can be legally multiplied (mathematically speaking).
  if (matrixOne[0].length !== matrixTwo.length) {
    throw new Error('Cannot multiply: matrices must be of sizes m x n and n x p to produce a valid answer');
  }

  // Multiply matrices.
  let result = [];
  let row, entry;
  for (let k = 0; k < matrixOne.length; k++) {
    row = [];
    for (let j = 0; j < matrixTwo[0].length; j++) {
      entry = 0;
      for (let i = 0; i < matrixOne[0].length; i++) {
        entry += matrixOne[k][i] * matrixTwo[i][j];
      }
      row.push(entry);
    }
    result.push(row);
  }
  return result;
}

module.exports = multiply;
