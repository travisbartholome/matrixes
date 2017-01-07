const isValidMatrix = require('./isValidMatrix.js');
const isSquare = require('./isSquare.js');

const det = require('./det.js');
const identity = require('./identity.js');
const copy = require('./copy.js');

function almostEquals(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

function inverse(inputMatrix) {
  if (!isValidMatrix(inputMatrix)) throw new Error('Invalid matrix');
  if (!isSquare(inputMatrix)) throw new Error('Matrix must be square to be inverted');
  if (det(inputMatrix) === 0) throw new Error('Matrix is singular (not invertible)');

  // So this doesn't alter the original argument.
  let matrix = copy(inputMatrix);
  let size = matrix.length;

  let output = identity(size);
  for (let i = 0; i < size; i++) {
    // Get a leading 1 in the given row.
    if (!almostEquals(matrix[i][i], 1, 2e-12)) {
      let scalar = matrix[i][i];
      // Swap rows if necessary
      if (scalar === 0) {
        let swapped = false;
        for (let j = i; j < matrix.length; j++) {
          if (matrix[j][i] !== 0) {
            let tmpRow = matrix[j].slice(0);
            matrix[j] = matrix[i].slice(0);
            matrix[i] = tmpRow;
            swapped = true;
            break;
          }
        }
        scalar = swapped ? matrix[i][i] : 1;
      }
      matrix[i] = matrix[i].map(x => x / scalar);
    }
    // Reduce all other entries in that column to 0. j => row
    // Reduces the rest of the row at the same time.
    for (let j = 0; j < size; j++) {
      if (j === i) continue; // Skip the row we just scaled (newest leading 1).
      let scalar = matrix[j][i];
      // k => column
      for (let k = 0; k < size; k++) {
        matrix[j][k] -= scalar * matrix[i][k];
        output[j][k] -= scalar * output[i][k];
      }
    }
  }

  return output;
}

module.exports = inverse;
