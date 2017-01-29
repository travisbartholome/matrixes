/** Following this pattern for adding methods:
 * function name(args) { ... };
 * Matrix.name = name;
 */

const Matrix = module.exports;

/* Matrix errors */

Matrix.error = require('./error.js');

/* Helper methods and assertion functions */

function almostEquals(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

function is2DArray(matrix) {
  if (!matrix || !Array.isArray(matrix)) return false;
  if (matrix.length === 0) return false; // Handles matrix === []
  for (let i = 0; i < matrix.length; i++) {
    if (!Array.isArray(matrix[i])) return false;
    for (let j = 0; j < matrix[i].length; j++) {
      // TODO: Does this catch all desired cases?
      if (typeof matrix[i][j] === 'object') return false;
    }
  }
  return true;
}
Matrix.is2DArray = is2DArray;

// --

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
Matrix.isRectangular = isRectangular;

// --

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
Matrix.isValidMatrix = isValidMatrix;

// --

function isSquare(matrix) {
  if (!isValidMatrix(matrix)) throw new Error(Matrix.error.invalidError);
  return isRectangular(matrix) && matrix.length === matrix[0].length;
}
Matrix.isSquare = isSquare;

// --

const precision = (function() {
  let precision = 2e-15;
  return {
    getPrecision: function() {
      return precision;
    },
    setPrecision: function(newPrecision) {
      if (newPrecision === 'default') {
        precision = 2e-15;
        return precision;
      } else if (typeof newPrecision !== 'number' || !isFinite(newPrecision) || isNaN(newPrecision)) {
        throw new Error('Input to setPrecision must be a finite number or "default"');
      } else {
        precision = newPrecision;
        return precision;
      }
    }
  };
})();
Matrix.getPrecision = precision.getPrecision;
Matrix.setPrecision = precision.setPrecision;

// --

function copy(matrix) {
  if (!isValidMatrix(matrix)) throw new Error(Matrix.error.invalidError);
  return matrix.map(row => row.slice(0));
}
Matrix.copy = copy;

// ---------------

/* Methods */

function add(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne.length !== matrixTwo.length || matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error(Matrix.error.dimensionError);
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

function augment(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne.length !== matrixTwo.length) {
    throw new Error(Matrix.error.dimensionRowError);
  }

  return matrixOne.map((row, index) => row.concat(matrixTwo[index]));
}
Matrix.augment = augment;

// --

function createMatrix(input) {
  if (typeof input !== 'string') throw new Error('Input to createMatrix must be a string');

  let matrix = input.replace(/[ ]*,[ ]+/g, ',').split(',').map(function(string) {
    return string.split(' ').map(function(entry) {
      let number = parseFloat(entry);
      if (isNaN(number) || !isFinite(number)) {
        throw new Error(Matrix.error.createNonFiniteError);
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
  if (!isValidMatrix(matrix)) throw new Error(Matrix.error.invalidError);
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

function findLongestEntry(mat) {
  if (!mat) return 0;
  return mat.reduce(function(longestEntry, currentRow) {
    let longestInRow = currentRow.reduce(function(len, cur) {
      if (cur.toString().length > len) len = cur.toString().length;
      return len;
    }, 0);
    if (longestInRow > longestEntry) longestEntry = longestInRow;
    return longestEntry;
  }, 0);
}

function disp(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne)) {
    throw new Error(Matrix.error.invalidError);
  }

  let isAugmented = Boolean(matrixTwo);
  if (isAugmented) {
    if (!isValidMatrix(matrixTwo)) {
      throw new Error(Matrix.error.invalidError);
    } else if (matrixTwo.length !== matrixOne.length) {
      throw new Error('Multiple arguments must have the same number of rows');
    }
  }

  let maxEntryLength = findLongestEntry(matrixOne);
  if (isAugmented) {
    maxEntryLength = Math.max(maxEntryLength, findLongestEntry(matrixTwo));
  }

  console.log('');

  let str, numStr, numLen;
  for (let i = 0; i < matrixOne.length; i++) {
    str = '( ';
    for (let j = 0; j < matrixOne[0].length; j++) {
      numStr = matrixOne[i][j].toString();
      numLen = numStr.length;
      for (let space = 0; space < maxEntryLength - numLen; space++) {
        str += ' ';
      }
      str += numStr + ' ';
    }
    if (isAugmented) {
      str += '| ';
      for (let j = 0; j < matrixTwo[0].length; j++) {
        numStr = matrixTwo[i][j].toString();
        numLen = numStr.length;
        for (let space = 0; space < maxEntryLength - numLen; space++) {
          str += ' ';
        }
        str += numStr + ' ';
      }
    }
    console.log(str + ')');
    console.log('');
  }
}
Matrix.disp = disp;

// --

function equals(matrixOne, matrixTwo, useNearEquality) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) throw new Error(Matrix.error.invalidError);

  if (matrixOne.length !== matrixTwo.length) return false;
  if (matrixOne[0].length !== matrixTwo[0].length) return false;

  for (let i = 0; i < matrixOne.length; i++) {
    for (let j = 0; j < matrixOne[0].length; j++) {
      if (matrixOne[i][j] !== matrixTwo[i][j]) {
        if (typeof useNearEquality === 'boolean' && useNearEquality) {
          if (almostEquals(matrixOne[i][j], matrixTwo[i][j], Matrix.getPrecision())) return true; // TODO: Just use getPrecision()
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
  if (!isValidMatrix(inputMatrix)) throw new Error(Matrix.error.invalidError);
  if (!isSquare(inputMatrix)) throw new Error('Matrix must be square to be inverted');
  if (det(inputMatrix) === 0) throw new Error('Matrix is singular (not invertible)');

  let size = inputMatrix.length;
  let id = identity(size);
  let matrix = inputMatrix.map((row, index) => row.concat(id[index]));

  let reduced = reduce(matrix);
  return reduced.map(row => row.slice(size));
}
Matrix.inverse = inverse;

// --

function multiply(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
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

function random(numRows, numColumns) {
  if (!Number.isInteger(numRows) || !Number.isInteger(numColumns)) {
    // Consider using Number.isSafeInteger here.
    throw new Error(Matrix.error.inputSizeIntegerError);
  }

  if (numRows <= 0 || numColumns <= 0) {
    throw new Error(Matrix.error.inputSizeNonnegativeError);
  }

  let matrix = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numColumns; j++) {
      row.push(Math.random());
    }
    matrix.push(row);
  }
  return matrix;
}
Matrix.random = random;

// --

function reduce(inputMatrix) {
  if (!isValidMatrix(inputMatrix)) throw new Error(Matrix.error.invalidError);
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
  if (!isValidMatrix(inputOne) || !isValidMatrix(inputTwo)) throw new Error(Matrix.error.invalidError);
  if (inputOne.length !== inputTwo.length) throw new Error(Matrix.error.dimensionRowError);
  let matrix = copy(inputOne).map((row, index) => row.concat(inputTwo[index].slice(0)));
  return reduce(matrix);
}
Matrix.reduceAug = reduceAug;

// --

function scale(matrix, scalar) {
  if (!isValidMatrix(matrix)) throw new Error(Matrix.error.invalidError);

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

function solve(coeffs, solutions) {
  if (!isValidMatrix(coeffs) || !isValidMatrix(solutions)) {
    throw new Error(Matrix.error.invalidError);
  }
  let reduced = reduceAug(coeffs, solutions);
  return reduced.map(row => row[row.length - 1]);
}
Matrix.solve = solve;

// --

function stack(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error(Matrix.error.dimensionColumnError);
  }

  return matrixOne.concat(matrixTwo);
}
Matrix.stack = stack;

// --

function subtract(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne.length !== matrixTwo.length || matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error(Matrix.error.dimensionError);
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

function transpose(matrix) {
  if (!isValidMatrix(matrix)) throw new Error(Matrix.error.invalidError);

  let output = [];
  for (let c = 0; c < matrix[0].length; c++) {
    let newRow = [];
    for (let r = 0; r < matrix.length; r++) {
      newRow.push(matrix[r][c]);
    }
    output.push(newRow);
  }

  return output;
}
Matrix.transpose = transpose;

// --

function zeros(numRows, numColumns) {
  if (!Number.isInteger(numRows) || !Number.isInteger(numColumns)) {
    // Consider using Number.isSafeInteger here.
    throw new Error(Matrix.error.inputSizeIntegerError);
  }

  if (numRows <= 0 || numColumns <= 0) {
    throw new Error(Matrix.error.inputSizeNonnegativeError);
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

/* Matrix.elements subclass */

Matrix.elements = {};

// --

Matrix.elements.divide = function(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne.length !== matrixTwo.length || matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error(Matrix.error.dimensionError);
  }

  // Might be faster to do this inside the other for loops?
  // This definitely avoids using unnecessary space, though.
  for (let i = 0; i < matrixTwo.length; i++) {
    for (let j = 0; j < matrixTwo[0].length; j++) {
      if (matrixTwo[i][j] === 0) {
        throw new Error('Cannot divide elements by zero');
      }
    }
  }

  let output = [], row;
  for (let i = 0; i < matrixOne.length; i++) {
    row = [];
    for (let j = 0; j < matrixOne[0].length; j++) {
      row.push(matrixOne[i][j] / matrixTwo[i][j]);
    }
    output.push(row);
  }
  return output;
};

// --

Matrix.elements.multiply = function(matrixOne, matrixTwo) {
  if (!isValidMatrix(matrixOne) || !isValidMatrix(matrixTwo)) {
    throw new Error(Matrix.error.invalidError);
  }

  if (matrixOne.length !== matrixTwo.length || matrixOne[0].length !== matrixTwo[0].length) {
    throw new Error(Matrix.error.dimensionError);
  }

  let output = [], row;
  for (let i = 0; i < matrixOne.length; i++) {
    row = [];
    for (let j = 0; j < matrixOne[0].length; j++) {
      row.push(matrixOne[i][j] * matrixTwo[i][j]);
    }
    output.push(row);
  }
  return output;
};

// --

Matrix.elements.power = function(inputMatrix, power) {
  if (!isValidMatrix(inputMatrix)) throw new Error(Matrix.error.invalidError);
  if (!isFinite(power) || isNaN(power)) {
    throw new Error('Power must be a real finite number');
  }
  return inputMatrix.map(row => row.map(x => Math.pow(x, power)));
};
