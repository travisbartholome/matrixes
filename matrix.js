/* Considering the pattern function name(args) { ... }; Matrix.name = name; */
const Matrix = module.exports;

const isValidMatrix = require('./functions/isValidMatrix.js');
const copy = require('./functions/copy.js');
const isRectangular = require('./functions/isRectangular.js');
const isSquare = require('./functions/isSquare.js');

function almostEquals(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

/* Helper methods and assertion functions */
Matrix.getPrecision = require('./functions/precision.js').getPrecision;
Matrix.setPrecision = require('./functions/precision.js').setPrecision;
Matrix.is2DArray = require('./functions/is2DArray.js');
Matrix.isRectangular = require('./functions/isRectangular.js');
Matrix.isSquare = require('./functions/isSquare.js');
Matrix.isValidMatrix = require('./functions/isValidMatrix.js');
Matrix.copy = require('./functions/copy.js');

/* Methods */

function add(matrixOne, matrixTwo) {
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
      output[i].push(matrixOne[i][j] + matrixTwo[i][j]);
    }
  }
  return output;
}
Matrix.add = add;

// --

function createMatrix(input) {
  if (typeof input !== 'string') throw new Error('Input to createMatrix must be a string');

  let matrix = input.replace(/, /g, ',').split(',').map(function(string) {
    return string.split(' ').map(function(entry) {
      let number = parseFloat(entry);
      if (isNaN(number) || !isFinite(number)) {
        throw new Error('Entries must all be finite numbers. Check your syntax for errors.');
      } else {
        return number;
        // TODO: Make this so that you can use math expressions as entries.
      }
    })
  });

  if (!isRectangular(matrix)) {
    throw new Error('Matrix must be rectangular');
  }

  return matrix;
}
Matrix.createMatrix = createMatrix;

// --

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
Matrix.det = det;

// --

function equals(matrixOne, matrixTwo, useNearEquality) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) throw new Error('Invalid matrix');

  if (matrixOne.length !== matrixTwo.length) return false;
  if (matrixOne[0].length !== matrixTwo[0].length) return false;

  for (let i = 0; i < matrixOne.length; i++) {
    for (let j = 0; j < matrixOne[0].length; j++) {
      if (matrixOne[i][j] !== matrixTwo[i][j]) {
        if (typeof useNearEquality === 'boolean' && useNearEquality) {
          if (almostEquals(matrixOne[i][j], matrixTwo[i][j], Matrix.getPrecision())) return true;
        }
        return false;
      }
    }
  }

  return true;
}
Matrix.equals = equals;

// --

function identity(size) {
  if (!Number.isInteger(size)) {
    throw new Error('Invalid matrix size: must be an integer');
  }

  if (size <= 0) {
    throw new Error('Invalid matrix size: must be greater than 0');
  }

  let matrix = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      if (j === i) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    matrix.push(row);
  }
  return matrix;
}
Matrix.identity = identity;

// --

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
            tmpRow = output[j].slice(0);
            output[j] = output[i].slice(0);
            output[i] = tmpRow;
            swapped = true;
            break;
          }
        }
        scalar = swapped ? matrix[i][i] : 1;
        // `scalar` should never be 1 in #inverse because that would imply a free variable.
        // (Which would mean that det(matrix) === 0).
      }
      matrix[i] = matrix[i].map(x => x / scalar);
      output[i] = output[i].map(x => x / scalar);
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
Matrix.inverse = inverse;

// --

function multiply(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error('Invalid matrix');
  }

  // Check if the matrices can be legally multiplied (mathematically speaking).
  if (matrixOne[0].length !== matrixTwo.length) {
    throw new Error('Cannot multiply: matrices must be of sizes m x n and n x p to produce a valid answer');
  }

  // Multiply matrices.
  let result = [];
  let row, entry;
  for (let k = 0; k < matrixOne.length; k++) {
    row = [];
    for (let j = 0; j < matrixTwo[0].length; j++) {
      entry = 0;
      for (let i = 0; i < matrixOne[0].length; i++) {
        entry += matrixOne[k][i] * matrixTwo[i][j];
      }
      row.push(entry);
    }
    result.push(row);
  }
  return result;
}
Matrix.multiply = multiply;

// --

function reduce(inputMatrix) {
  if (!isValidMatrix(inputMatrix)) throw new Error('Invalid matrix');
  let matrix = copy(inputMatrix);
  let size = Math.min(matrix.length, matrix[0].length);
  for (let i = 0; i < size; i++) {
    // Get a leading 1 in the given row.
    if (!almostEquals(matrix[i][i], 1, 2e-12)) {
      let scalar = matrix[i][i];
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
    for (let j = 0; j < matrix.length; j++) {
      if (j === i) continue; // Skip the row we just scaled (newest leading 1).
      let scalar = matrix[j][i];
      // k => column
      for (let k = 0; k < matrix[0].length; k++) {
        matrix[j][k] -= scalar * matrix[i][k];
      }
    }
  }
  return matrix;
}
Matrix.reduce = reduce;

// --

function reduceAug(inputOne, inputTwo) {
  if (!isValidMatrix(inputOne) || !isValidMatrix(inputTwo)) throw new Error('Invalid matrix');
  let matrix = copy(inputOne).map((row, index) => row.concat(inputTwo[index].slice(0)));
  return Matrix.reduce(matrix);
}
Matrix.reduceAug = reduceAug;

// --

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
Matrix.scale = scale;

// --

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
Matrix.subtract = subtract;

// --

function zeros(numRows, numColumns) {
  if (!Number.isInteger(numRows) || !Number.isInteger(numColumns)) {
    // Consider using Number.isSafeInteger here.
    throw new Error('Invalid matrix size: both row size and column size must be an integer');
  }

  if (numRows <= 0 || numColumns <= 0) {
    throw new Error('Invalid matrix size: both row size and column size must be greater than 0');
  }

  let matrix = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numColumns; j++) {
      row.push(0)
    }
    matrix.push(row);
  }
  return matrix;
}
Matrix.zeros = zeros;
