const isRectangular = require('./isRectangular.js');
const isValidMatrix = require('./isValidMatrix.js');

function isSquare(matrix) {
  if (!isValidMatrix(matrix)) throw new Error('Invalid matrix');
  return isRectangular(matrix) && matrix.length === matrix[0].length;
}

module.exports = isSquare;
