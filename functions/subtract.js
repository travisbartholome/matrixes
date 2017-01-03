const isValidMatrix = require('./isValidMatrix.js');

function subtract(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error('Invalid matrix');
  }

  if (matrixOne.length !== matrixTwo.length || matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error('Matrices must have the same dimensions');
  }

  let output = [];
  for (let i = 0; i < matrixOne.length; i++) {
    output.push([]);
    for (let j = 0; j < matrixOne[0].length; j++) {
      output[i].push(matrixOne[i][j] - matrixTwo[i][j]);
    }
  }
  return output;
}

module.exports = subtract;
