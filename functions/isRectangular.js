const is2DArray = require('./is2DArray.js');

function isRectangular(matrix) {
  if (!is2DArray(matrix)) return false;
  let rowLength = matrix[0].length;
  for (var i = 0; i < matrix.length; i++) {
    if (matrix[i].length !== rowLength) {
      return false;
    }
  }
  return true;
}

module.exports = isRectangular;
