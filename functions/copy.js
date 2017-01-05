const isValidMatrix = require('./isValidMatrix.js');

function copy(matrix) {
  if (!isValidMatrix(matrix)) throw new Error('Invalid matrix');
  return matrix.map(row => row.slice(0));
}

module.exports = copy;
