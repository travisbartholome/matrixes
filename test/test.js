/* I'm trying to use TDD! Interesting so far. */

// Using Mocha and Chai for unit testing.
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
chai.should(); // Do I need this?

// Test module
const matrix = require('../matrix.js');

// Shorthand methods
const str = JSON.stringify;
const equals = matrix.equals;

// Invalid matrices
const INVALID_MATRICES = [
  {},
  [],
  '',
  'asdf',
  '1234',
  function() { return 3; },
  [[function() { return 3; }], [1]], // Contains a function
  [['1', '2'],['1', '2']], // Strings
  { 0: [1, 2], 1: [1, 2] },
  [[[], 1]], // Array is a matrix element
  [[1, 2, 3], [1, 2], [2, 3, 4]], // Uneven rows
  [[1, 2, 3], [1, 2], [3]], // Uneven rows
  [[1, 2, 3], [1, 2, 'a'], [1, 2, 3]], // Strings
  [[1, 2], [NaN, 4]], // Contains NaN
  [[1, Infinity], [3, 4]], // Contains Infinity
  [[]] // Decided this should be invalid. Dimensions must be greater than 0.
];



/* Creator functions */

describe('createMatrix', function() {
  it('Should return the correct matrix from a valid input string.', function() {
    assert.equal(equals(matrix.createMatrix('1 2, 3 4'), [[1, 2], [3, 4]]), true);
    assert.equal(equals(matrix.createMatrix('1 2,3 4'), [[1, 2], [3, 4]]), true);
    assert.equal(equals(matrix.createMatrix('0, 0, 0'), [[0],[0],[0]]), true);
  });

  it('Should support scientific notation and integer-equivalent floats.', function() {
    assert.equal(equals(matrix.createMatrix('1.123 2.3, 5.00 1e3'), [[1.123, 2.3],[5, 1000]]), true);
  });

  it('Should throw an error if the input has non-numerical entries in a correctly-formatted string.', function() {
    expect(() => matrix.createMatrix('1 g, 3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('asdf asdf')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2 3, 4 5 6, g h j')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 NaN, 3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2, 3 Infinity')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2,,3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('[;]tfxm')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
  });

  it('Should throw an error if the input is not a string.', function() {
    expect(() => matrix.createMatrix()).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix({})).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix([])).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(1234)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(NaN)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(String.prototype)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(function() { return 3; })).to.throw('Input to createMatrix must be a string');
  });

  it('Should throw an error if the matrix would not be rectangular.', function() {
    expect(() => matrix.createMatrix('1 2, 1')).to.throw('Matrix must be rectangular');
    expect(() => matrix.createMatrix('1, 2, 3 4')).to.throw('Matrix must be rectangular');
    expect(() => matrix.createMatrix('1 2, 3 4, 5 6 7')).to.throw('Matrix must be rectangular');
  });
});

describe('identity', function() {
  it('Should return an identity matrix with the size that was passed in.', function() {
    assert.equal(equals(matrix.identity(2), [[1,0],[0,1]]), true);
    assert.equal(equals(matrix.identity(5), [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]), true);
  });

  it('Should accept integers stored as floats with decimal zeros.', function() {
    assert.equal(equals(matrix.identity(2.000), [[1,0],[0,1]]), true);
    assert.equal(equals(matrix.identity(4.000), [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]), true);
  });

  it('Should throw an error for all non-integer arguments.', function() {
    expect(() => matrix.identity(1.23)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(3.212)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(Infinity)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(-Infinity)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(NaN)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity('asdf')).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity([])).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity({})).to.throw('Invalid matrix size: must be an integer');
  });

  it('Should throw an error if the argument is <= 0.', function() {
    expect(() => matrix.identity(0)).to.throw('Invalid matrix size: must be greater than 0');
    expect(() => matrix.identity(-1)).to.throw('Invalid matrix size: must be greater than 0');
    expect(() => matrix.identity(-5)).to.throw('Invalid matrix size: must be greater than 0');
  });
});

describe('zeros', function() {
  it('Should return a zero matrix with the size that was passed in.', function() {
    assert.equal(equals(matrix.zeros(2, 2), [[0, 0], [0, 0]]), true);
    assert.equal(equals(matrix.zeros(2, 3), [[0,0,0],[0,0,0]]), true);
    assert.equal(equals(matrix.zeros(3, 1), [[0],[0],[0]]), true);
  });

  it('Should accept integers stored as floats with decimal zeros.', function() {
    assert.equal(equals(matrix.zeros(2.00, 2), [[0, 0], [0, 0]]), true);
    assert.equal(equals(matrix.zeros(3.0, 3.00), [[0,0,0],[0,0,0],[0,0,0]]), true);
    assert.equal(equals(matrix.zeros(1.0000, 2.0), [[0, 0]]), true);
  });

  it('Should throw an error for all non-integer arguments.', function() {
    expect(() => matrix.zeros(1.23, 3)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(2, 3.212)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros('2', 3)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(Infinity, 3)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(2, -Infinity)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(NaN, 3)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(2, 'asdf')).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros([], 3)).to.throw('Invalid matrix size: both row size and column size must be an integer');
    expect(() => matrix.zeros(2, {})).to.throw('Invalid matrix size: both row size and column size must be an integer');
  });

  it('Should throw an error if the argument is <= 0.', function() {
    expect(() => matrix.zeros(0, 3)).to.throw('Invalid matrix size: both row size and column size must be greater than 0');
    expect(() => matrix.zeros(2, -1)).to.throw('Invalid matrix size: both row size and column size must be greater than 0');
    expect(() => matrix.zeros(-2, 0)).to.throw('Invalid matrix size: both row size and column size must be greater than 0');
    expect(() => matrix.zeros(0, 0)).to.throw('Invalid matrix size: both row size and column size must be greater than 0');
    expect(() => matrix.zeros(0, -3)).to.throw('Invalid matrix size: both row size and column size must be greater than 0');
  });
});



/* Operators */

describe('multiply', function() {
  it('Should return the matrix product of two numeric matrices.', function() {
    assert.equal(str(matrix.multiply([[1, 2, 3], [4, 5, 6]], [[1, 2],[3, 4], [5, 6]])), str([[22, 28], [49, 64]]));
    assert.equal(str(matrix.multiply([[1, 0], [0, 1]], [[1], [1]])), str([[1], [1]]));
    assert.equal(str(matrix.multiply([[1, 0], [0, 1]], [[8], [6]])), str([[8], [6]]));
    assert.equal(str(matrix.multiply([[1], [2]], [[2, 3]])), str([[2, 3], [4, 6]]));
  });
});



/* Assertions */

describe('equals', function() {
  // Global scope: const equals = matrix.equals
  let a = [[1, 2], [3, 4]],
      b = [[1, 2, 3], [1, 2, 3], [1, 2, 3]],
      c = [[1], [2], [3]],
      d = [[1, 2], [3, 4]],
      e = [[1, 2], [1, 2]];
  let i = {
    a: [],
    b: 'a',
    c: '[[1, 2], [1, 2]]',
    d: [[1, 2], [3], [1, 2, 3]],
    e: {}
  };

  it('Should return whether or not two valid matrices are equal.', function() {
    assert.equal(equals(a, d), true);
    assert.equal(equals(b, b), true);
    assert.equal(equals(a, b), false);
    assert.equal(equals(a, e), false);
    assert.equal(equals(b, c), false);
  });

  it('Should throw an error if either matrix is invalid.', function() {
    expect(() => equals(a, i.a)).to.throw('Invalid matrix');
    expect(() => equals(b, i.b)).to.throw('Invalid matrix');
    expect(() => equals(c, i.c)).to.throw('Invalid matrix');
    expect(() => equals(d, i.d)).to.throw('Invalid matrix');
    expect(() => equals(e, i.e)).to.throw('Invalid matrix');
  });
});

describe('is2DArray', function() {
  it('Should return whether the argument is an array of arrays.', function() {
    assert.equal(matrix.is2DArray([[1, 2, 3], []]), true);
    assert.equal(matrix.is2DArray([['1', '2'],['1', '2']]), true);
    assert.equal(matrix.is2DArray([[1, 2], [NaN, 4]]), true);
    assert.equal(matrix.is2DArray([[]]), true);
    assert.equal(matrix.is2DArray([[1, 2, 3], [1, 2], [2, 3, 4]]), true);
    assert.equal(matrix.is2DArray([[0, 0, 0], [0, 0, 0], [0, 0, 0]]), true);
    assert.equal(matrix.is2DArray([[1, 2], [3, 4]]), true);
    assert.equal(matrix.is2DArray([[function() { return 3; }], [1]]), true);
    assert.equal(matrix.is2DArray([[1, 2], [{'a':3}, 4]]), false);
    assert.equal(matrix.is2DArray([[[]]]), false);
    assert.equal(matrix.is2DArray({ 0: [1, 2], 1: [1, 2] }), false);
    assert.equal(matrix.is2DArray('asdf'), false);
    assert.equal(matrix.is2DArray([]), false);
    assert.equal(matrix.is2DArray({}), false);
  });
});

describe('isRectangular', function() {
  it('Should return whether a two-dimensional array is rectangular.', function() {
    assert.equal(matrix.isRectangular([[1, 2], [1, 2], [1, 2]]), true);
    assert.equal(matrix.isRectangular([[]]), true);
    assert.equal(matrix.isRectangular([[function() { return 3; }], [1]]), true);
    assert.equal(matrix.isRectangular([[1, 2], [NaN, 4]]), true);
    assert.equal(matrix.isRectangular([[1, NaN], ['asdf', Infinity], [() => 'yep, this is a function', 2]]), true);
    assert.equal(matrix.isRectangular([['1', '2'],['1', '2']]), true);
    assert.equal(matrix.isRectangular([[1, 2, 3], [1, 2, 'a'], [1, 2, 3]]), true);
    assert.equal(matrix.isRectangular([[1, 2, 3], [1, 2], [3]]), false);
    assert.equal(matrix.isRectangular({ 0: [1, 2], 1: [1, 2] }), false);
    assert.equal(matrix.isRectangular('asdf'), false);
    assert.equal(matrix.isRectangular(''), false);
    assert.equal(matrix.isRectangular([]), false);
    assert.equal(matrix.isRectangular({}), false);
    assert.equal(matrix.isRectangular(function() { return 3; }), false);
    assert.equal(matrix.isRectangular([[1, 2], [1]]), false);
  });
});

describe('isSquare', function() {
  it('Should return whether a matrix is square.', function() {
    assert.equal(matrix.isSquare([[1, 2], [1, 2]]), true);
    assert.equal(matrix.isSquare([[1]]), true);
    assert.equal(matrix.isSquare([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), true);
    assert.equal(matrix.isSquare([[1, 2], [3, 4], [5, 6]]), false);
    assert.equal(matrix.isSquare([[1], [2]]), false);
  });

  it('Should throw an error if the argument is not a valid matrix.', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.isSquare(INVALID_MATRICES[i])).to.throw('Invalid matrix');
    }
  });
});

describe('isValidMatrix', function() {
  it('Should return whether or not the argument is a valid matrix.', function() {
    let validCases = [
      [[1, 2], [3, 4]],
      [[1]],
      [[-1, 0, 1], [1, 7, 0], [3, 5, -3]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    ];

    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      assert.equal(matrix.isValidMatrix(INVALID_MATRICES[i]), false);
    }

    for (let j = 0; j < validCases.length; j++) {
      assert.equal(matrix.isValidMatrix(validCases[j]), true);
    }
  });
});
