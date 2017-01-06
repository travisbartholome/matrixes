const isValidMatrix = require('./isValidMatrix.js');
const copy = require('./copy.js');

function almostEquals(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

function reduce(inputMatrix) {
  if (!isValidMatrix(inputMatrix)) throw new Error('Invalid matrix');
  let matrix = copy(inputMatrix);
  let size = Math.min(matrix.length, matrix[0].length);
  for (let i = 0; i < size; i++) {
    // Get a leading 1 in the given row.
    if (!almostEquals(matrix[i][i], 1, 2e-12)) {
      let scalar = matrix[i][i];
      if (scalar === 0) scalar = 1; // TODO/NOTE: This is a hack.
      matrix[i] = matrix[i].map(x => x / scalar);
    }
    // Reduce all other entries in that column to 0. j => row
    // Reduces the rest of the row at the same time.
    for (let j = 0; j < matrix.length; j++) {
      if (j === i) continue; // Skip the row we just scaled (newest leading 1).
      let scalar = matrix[j][i];
      // k => column
      for (let k = 0; k < matrix[0].length; k++) {
        matrix[j][k] -= scalar * matrix[i][k];
      }
    }
  }
  return matrix;
}

module.exports = reduce;
