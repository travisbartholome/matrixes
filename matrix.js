const Matrix = module.exports;

Matrix.add = require('./functions/add.js');
Matrix.copy = require('./functions/copy.js');
Matrix.createMatrix = require('./functions/createMatrix.js');
Matrix.det = require('./functions/det.js');
Matrix.equals = require('./functions/equals.js');
Matrix.getPrecision = require('./functions/precision.js').getPrecision;
Matrix.identity = require('./functions/identity.js');
Matrix.inverse = require('./functions/inverse.js');
Matrix.is2DArray = require('./functions/is2DArray.js');
Matrix.isRectangular = require('./functions/isRectangular.js');
Matrix.isSquare = require('./functions/isSquare.js');
Matrix.isValidMatrix = require('./functions/isValidMatrix.js');
Matrix.multiply = require('./functions/multiply.js');
Matrix.reduce = require('./functions/reduce.js');
Matrix.reduceAug = require('./functions/reduceAug.js');
Matrix.scale = require('./functions/scale.js');
Matrix.setPrecision = require('./functions/precision.js').setPrecision;

const isValidMatrix = require('./functions/isValidMatrix.js'); // TODO: Remove this
Matrix.subtract = function subtract(matrixOne, matrixTwo) {
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

// --

Matrix.zeros = function zeros(numRows, numColumns) {
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
