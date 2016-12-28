const isValidMatrix = require('./isValidMatrix.js');

function scale(matrix, scalar) {
  if (!isValidMatrix(matrix)) throw new Error('Invalid matrix');

  if (typeof scalar !== 'number' || isNaN(scalar) || !isFinite(scalar)) {
    throw new Error('Invalid scalar: must be a finite number');
  }

  let newMatrix = [], row;

  for (let i = 0; i < matrix.length; i++) {
    row = [];
    for (let j = 0; j < matrix[0].length; j++) {
      row.push(matrix[i][j] * scalar);
    }
    newMatrix.push(row);
  }

  return newMatrix;
}

module.exports = scale;
