const isValidMatrix = require('./isValidMatrix.js');

function equals(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) throw new Error('Invalid matrix');

  if (matrixOne.length !== matrixTwo.length) return false;
  if (matrixOne[0].length !== matrixTwo[0].length) return false;

  for (let i = 0; i < matrixOne.length; i++) {
    for (let j = 0; j < matrixOne[0].length; j++) {
      if (matrixOne[i][j] !== matrixTwo[i][j]) return false;
    }
  }

  return true;
}

module.exports = equals;
