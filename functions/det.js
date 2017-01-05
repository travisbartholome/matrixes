const isValidMatrix = require('./isValidMatrix.js');
const isSquare = require('./isSquare.js');

function det(matrix) {
  if (!isValidMatrix(matrix)) throw new Error('Invalid matrix');
  if (!isSquare(matrix)) throw new Error('Matrix must be square to take a determinant');

  if (matrix.length === 2) {
    // Base case
    return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
  } else {
    let output = 0;
    // Always reduce using the first row.
    for (let i = 0; i < matrix.length; i++) {
      // Check for the easy case where the coefiicient is 0.
      if (matrix[0][i] === 0) continue;

      // Remove the first row.
      let newMatrix = matrix.slice(1).map(
        // Remove the ith column.
        row => row.slice(0,i).concat(row.slice(i+1))
      );

      // Recursively reduce, alternating + and -
      output += Math.pow(-1, i % 2) * matrix[0][i] * det(newMatrix);
    }
    return output;
  }
}

module.exports = det;
