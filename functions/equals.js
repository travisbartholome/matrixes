const isValidMatrix = require('./isValidMatrix.js');

function almostEqual(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

function equals(matrixOne, matrixTwo, useNearEquality) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) throw new Error('Invalid matrix');

  if (matrixOne.length !== matrixTwo.length) return false;
  if (matrixOne[0].length !== matrixTwo[0].length) return false;

  for (let i = 0; i < matrixOne.length; i++) {
    for (let j = 0; j < matrixOne[0].length; j++) {
      if (matrixOne[i][j] !== matrixTwo[i][j]) {
        // TODO: Allow user to set default precision for these calculations, then use that set precision in this function.
        if (typeof useNearEquality === 'boolean' && useNearEquality) {
          if (almostEqual(matrixOne[i][j], matrixTwo[i][j], 2e-15)) return true;
        }
        return false;
      }
    }
  }

  return true;
}

module.exports = equals;
