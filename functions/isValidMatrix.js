const is2DArray = require('./is2DArray.js');
const isRectangular = require('./isRectangular.js');

function isValidMatrix(matrix) {
  if (!is2DArray(matrix)) return false;
  if (!isRectangular(matrix)) return false;

  if (matrix.length === 0) return false;
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].length === 0) return false;
    for (let j = 0; j < matrix[i].length; j++) {
      if (typeof matrix[i][j] !== 'number') return false;
      if (isNaN(matrix[i][j])) return false;
      if (!isFinite(matrix[i][j])) return false;
    }
  }

  return true;
}

module.exports = isValidMatrix;
