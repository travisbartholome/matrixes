const matrix = module.exports;

// Creator functions
matrix.createMatrix = require('./functions/createMatrix.js');
matrix.identity = require('./functions/identity.js');
matrix.zeros = require('./functions/zeros.js');

// Operations
matrix.multiply = require('./functions/multiply.js');

// Assertions
matrix.equals = require('./functions/equals.js');
matrix.is2DArray = require('./functions/is2DArray.js');
matrix.isRectangular = require('./functions/isRectangular.js');
matrix.isSquare = require('./functions/isSquare.js');
matrix.isValidMatrix = require('./functions/isValidMatrix.js');
