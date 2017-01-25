/* I'm trying to use TDD! Interesting so far. */

// Using Mocha and Chai for unit testing.
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
chai.should(); // Do I need this?

// Test module
const matrix = require('../matrix.js');

// Used to test near-equality
function almostEquals(numberOne, numberTwo, precision) {
  return Math.abs(numberOne - numberTwo) <= precision;
}

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

describe('#createMatrix', function() {
  it('should return the correct matrix from a valid input string.', function() {
    assert.equal(equals(matrix.createMatrix('1 2, 3 4'), [[1, 2], [3, 4]]), true);
    assert.equal(equals(matrix.createMatrix('1 2,3 4'), [[1, 2], [3, 4]]), true);
    assert.equal(equals(matrix.createMatrix('0, 0, 0'), [[0],[0],[0]]), true);
  });

  it('should support scientific notation and integer-equivalent floats.', function() {
    assert.equal(equals(matrix.createMatrix('1.123 2.3, 5.00 1e3'), [[1.123, 2.3],[5, 1000]]), true);
  });

  it('should throw an error if the input has non-numerical entries in a correctly-formatted string.', function() {
    expect(() => matrix.createMatrix('1 g, 3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('asdf asdf')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2 3, 4 5 6, g h j')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 NaN, 3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2, 3 Infinity')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('1 2,,3 4')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
    expect(() => matrix.createMatrix('[;]tfxm')).to.throw('Entries must all be finite numbers. Check your syntax for errors.');
  });

  it('should throw an error if the input is not a string.', function() {
    expect(() => matrix.createMatrix()).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix({})).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix([])).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(1234)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(NaN)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(String.prototype)).to.throw('Input to createMatrix must be a string');
    expect(() => matrix.createMatrix(function() { return 3; })).to.throw('Input to createMatrix must be a string');
  });

  it('should throw an error if the matrix would not be rectangular.', function() {
    expect(() => matrix.createMatrix('1 2, 1')).to.throw('Matrix must be rectangular');
    expect(() => matrix.createMatrix('1, 2, 3 4')).to.throw('Matrix must be rectangular');
    expect(() => matrix.createMatrix('1 2, 3 4, 5 6 7')).to.throw('Matrix must be rectangular');
  });
});

describe('#identity', function() {
  it('should return an identity matrix with the size that was passed in.', function() {
    assert.equal(equals(matrix.identity(2), [[1,0],[0,1]]), true);
    assert.equal(equals(matrix.identity(5), [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]), true);
  });

  it('should accept integers stored as floats with decimal zeros.', function() {
    assert.equal(equals(matrix.identity(2.000), [[1,0],[0,1]]), true);
    assert.equal(equals(matrix.identity(4.000), [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]), true);
  });

  it('should throw an error for all non-integer arguments.', function() {
    expect(() => matrix.identity(1.23)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(3.212)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(Infinity)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(-Infinity)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity(NaN)).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity('asdf')).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity([])).to.throw('Invalid matrix size: must be an integer');
    expect(() => matrix.identity({})).to.throw('Invalid matrix size: must be an integer');
  });

  it('should throw an error if the argument is <= 0.', function() {
    expect(() => matrix.identity(0)).to.throw('Invalid matrix size: must be greater than 0');
    expect(() => matrix.identity(-1)).to.throw('Invalid matrix size: must be greater than 0');
    expect(() => matrix.identity(-5)).to.throw('Invalid matrix size: must be greater than 0');
  });
});

describe('#random', function() {
  it('should return a random matrix (elements between 0 and 1) with the dimensions that were passed in', function() {
    // Can I create a better way to test the content here?
    let rand = matrix.random(3, 4);
    assert.equal(rand.length, 3);
    assert.equal(rand[0].length, 4);
    let elementsInRange = true, isRandom = true;
    let prev = 1;
    for (let i = 0; i < rand.length; i++) {
      for (let j = 0; j < rand[0].length; j++) {
        if (rand[i][j] < 0 || rand[i][j] >= 1) {
          elementsInRange = false;
          break;
        }
        if (prev === rand[i][j]) {
          isRandom = false;
          break;
        }
        prev = rand[i][j];
      }
      if (!elementsInRange || !isRandom) break;
    }
    assert.equal(elementsInRange && isRandom, true);
  });

  it('should accept integers stored as floats with decimal zeros', function() {
    let d1 = 2.00, d2 = 3.0, d3 = 1.0000;
    let m1 = matrix.random(d1, d3),
        m2 = matrix.random(d2, d1),
        m3 = matrix.random(d3, d2);
    assert.equal(m1.length, d1);
    assert.equal(m2.length, d2);
    assert.equal(m3.length, d3);
    assert.equal(m1[0].length, d3);
    assert.equal(m2[0].length, d1);
    assert.equal(m3[0].length, d2);
  });

  it('should throw an error for all non-integer arguments', function() {
    let integerSizeError = 'Invalid matrix size: both row size and column size must be an integer';
    expect(() => matrix.random(1.23, 3)).to.throw(integerSizeError);
    expect(() => matrix.random(2, NaN)).to.throw(integerSizeError);
    expect(() => matrix.random('2', 3)).to.throw(integerSizeError);
    expect(() => matrix.random(Infinity, 3)).to.throw(integerSizeError);
  });

  it('should throw an error if the argument is <= 0', function() {
    let nonzeroSizeError = 'Invalid matrix size: both row size and column size must be greater than 0';
    expect(() => matrix.random(0, 3)).to.throw(nonzeroSizeError);
    expect(() => matrix.random(2, -1)).to.throw(nonzeroSizeError);
    expect(() => matrix.random(-2, 0)).to.throw(nonzeroSizeError);
  });
});

describe('#zeros', function() {
  it('should return a zero matrix with the size that was passed in.', function() {
    assert.equal(equals(matrix.zeros(2, 2), [[0, 0], [0, 0]]), true);
    assert.equal(equals(matrix.zeros(2, 3), [[0,0,0],[0,0,0]]), true);
    assert.equal(equals(matrix.zeros(3, 1), [[0],[0],[0]]), true);
  });

  it('should accept integers stored as floats with decimal zeros.', function() {
    assert.equal(equals(matrix.zeros(2.00, 2), [[0, 0], [0, 0]]), true);
    assert.equal(equals(matrix.zeros(3.0, 3.00), [[0,0,0],[0,0,0],[0,0,0]]), true);
    assert.equal(equals(matrix.zeros(1.0000, 2.0), [[0, 0]]), true);
  });

  it('should throw an error for all non-integer arguments.', function() {
    let integerSizeError = 'Invalid matrix size: both row size and column size must be an integer';
    expect(() => matrix.zeros(1.23, 3)).to.throw(integerSizeError);
    expect(() => matrix.zeros(2, 3.212)).to.throw(integerSizeError);
    expect(() => matrix.zeros('2', 3)).to.throw(integerSizeError);
    expect(() => matrix.zeros(Infinity, 3)).to.throw(integerSizeError);
    expect(() => matrix.zeros(2, -Infinity)).to.throw(integerSizeError);
    expect(() => matrix.zeros(NaN, 3)).to.throw(integerSizeError);
    expect(() => matrix.zeros(2, 'asdf')).to.throw(integerSizeError);
    expect(() => matrix.zeros([], 3)).to.throw(integerSizeError);
    expect(() => matrix.zeros(2, {})).to.throw(integerSizeError);
  });

  it('should throw an error if the argument is <= 0.', function() {
    let nonzeroSizeError = 'Invalid matrix size: both row size and column size must be greater than 0';
    expect(() => matrix.zeros(0, 3)).to.throw(nonzeroSizeError);
    expect(() => matrix.zeros(2, -1)).to.throw(nonzeroSizeError);
    expect(() => matrix.zeros(-2, 0)).to.throw(nonzeroSizeError);
    expect(() => matrix.zeros(0, 0)).to.throw(nonzeroSizeError);
    expect(() => matrix.zeros(0, -3)).to.throw(nonzeroSizeError);
  });
});



/* Operators */

describe('#add', function() {
  it('should return the sum of two matrices', function() {
    assert.equal(equals(matrix.add([[1, 2, 3],[4, 5, 6]], [[0, -1, 2],[3, -4, -5]]), [[1, 1, 5],[7, 1, 1]]), true);
    assert.equal(equals(matrix.add([[1, 2], [1, 2]], [[0, 2], [3, -4]]), [[1, 4], [4, -2]]), true);
  });

  it('should throw an error if the two matrices do not have the same dimensions', function() {
    expect(() => matrix.add([[1, 2, 3], [1, 2, 3]], [[1, 2], [3, 4]])).to.throw('Matrices must have the same dimensions');
  });

  it('should throw an error if either matrix is invalid', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.add([[1, 2],[3, 4]], INVALID_MATRICES[i])).to.throw('Invalid matrix');
    }
  });
});

describe('#augment', function() {
  it('should return the augmented matrix A|B where A and B are the two arguments', function() {
    let m1 = [[1,2],[3,0],[2,1]];
    let m2 = [[3,2],[1,2],[3,0]];
    let aug = matrix.augment(m1, m2);
    let correct = [[1,2,3,2],[3,0,1,2],[2,1,3,0]];
    assert.equal(equals(aug, correct), true);
  });

  it('should not alter either argument', function() {
    let m1 = [[1,2],[3,4]];
    let m2 = [[1],[2]];
    let aug = matrix.augment(m1, m2)
    assert.equal(equals(m1, [[1,2],[3,4]]), true);
    assert.equal(equals(m2, [[1],[2]]), true);
  });

  it('should throw an error if the matrices do not have the same number of rows', function() {
    expect(() => matrix.augment([[1,2],[1,2],[1,2]], [[0,2],[3,1]]))
    .to.throw('Matrices must have the same number of rows');
  });

  it('should throw an error if either argument is not a valid matrix', function() {
    expect(() => matrix.augment('g', [[1,2],[1,2]])).to.throw('Invalid matrix');
    expect(() => matrix.augment([[1,2],[1,2]], {})).to.throw('Invalid matrix');
  });
});

describe('#det', function() {
  it('should return the determinant of a matrix', function() {
    assert.equal(matrix.det([[1,2],[1,2]]), 0);
    assert.equal(matrix.det([[1,2],[3,4]]), -2);
    assert.equal(matrix.det([[1,2,3],[2,2,1],[1,2,1]]), 4);
    assert.equal(matrix.det([[1,0,1,1],[0,2,1,1],[0,3,0,2],[0,1,1,0]]), 1);
  });

  it('should throw an error if the matrix is not square', function() {
    expect(() => matrix.det([[1,2,3],[1,2,3]])).to.throw('Matrix must be square to take a determinant');
  });

  it('should throw an error if the matrix is invalid', function() {
    expect(() => matrix.det({})).to.throw('Invalid matrix');
  });
});

describe('#inverse', function() {
  it('should return the inverse of a square matrix', function() {
    assert.equal(equals( matrix.inverse([[1,2,3],[0,1,4],[5,6,0]]), [[-24,18,5],[20,-15,-4],[-5,4,1]], true ), true);
  });

  it('should not alter the original argument', function() {
    let startMatrix = [[1,2,3],[0,1,4],[5,6,0]];
    let inv = matrix.inverse(startMatrix);
    assert.equal(equals( startMatrix, [[1,2,3],[0,1,4],[5,6,0]] ), true);
  });

  it('should support row swapping when there is a 0 where we would expect a leading 1', function() {
    assert.equal(equals(matrix.inverse([[1,2,2],[1,2,3],[2,1,1]]), [[-1/3,0,2/3],[5/3,-1,-1/3],[-1,1,0]], true), true);
  });

  it('should throw an error if a singular square matrix is passed', function() {
    expect(() => matrix.inverse([[1,2],[1,2]])).to.throw('Matrix is singular (not invertible)');
  });

  it('should throw an error if the given matrix is not square', function() {
    expect(() => matrix.inverse([[1, 2, 3], [1, 2, 3]])).to.throw('Matrix must be square to be inverted');
  });

  it('should throw an error if the argument is not a valid matrix', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.inverse(INVALID_MATRICES[i])).to.throw('Invalid matrix');
    }
  });
});

describe('#multiply', function() {
  it('should return the matrix product of two numeric matrices.', function() {
    assert.equal(str(matrix.multiply([[1, 2, 3], [4, 5, 6]], [[1, 2],[3, 4], [5, 6]])), str([[22, 28], [49, 64]]));
    assert.equal(str(matrix.multiply([[1, 0], [0, 1]], [[1], [1]])), str([[1], [1]]));
    assert.equal(str(matrix.multiply([[1, 0], [0, 1]], [[8], [6]])), str([[8], [6]]));
    assert.equal(str(matrix.multiply([[1], [2]], [[2, 3]])), str([[2, 3], [4, 6]]));
  });

  it('should throw an error if either matrix is invalid', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.multiply(INVALID_MATRICES[i], [[1, 2],[3, 4]])).to.throw('Invalid matrix');
    }
  });

  it('should throw an error if the matrices can\'t legally be multiplied', function() {
    let noMult = 'Cannot multiply: matrices must be of sizes m x n and n x p to produce a valid answer';
    expect(() => matrix.multiply([[1, 2, 3], [4, 5, 6]], [[1, 2], [3, 4]])).to.throw(noMult);
  });
});

describe('#reduce', function() {
  it('should return the reduced row echelon form of a single matrix argument', function() {
    assert.equal(equals(matrix.reduce([[1, 2],[1, 2]]), [[1, 2],[0, 0]]), true);
    assert.equal(equals(matrix.reduce([[1, 1, 3], [1, 2, 1]]), [[1, 0, 5],[0, 1, -2]]), true);
    assert.equal(equals(matrix.reduce([[1, 2, 3],[-1, -2, -3],[2, 4, 6]]), [[1, 2, 3],[0, 0, 0],[0, 0, 0]]), true);
    assert.equal(equals(matrix.reduce([[1,2],[1,3],[2,2]]), [[1,0],[0,1],[0,0]]), true);
  });

  it('should support row swapping when there is a 0 where we would expect a leading 1', function() {
    // Without row switching this reduction used to give [ [ 1, 2, 0 ], [ 0, 3, 1 ], [ 0, -3, 0 ] ]
    assert.equal(equals(matrix.reduce([[1, 2, 2], [1, 2, 3], [2, 1, 1]]), matrix.identity(3)), true);
  });

  it('should not swap any rows if no swap would give a leading nonzero entry', function() {
    assert.equal(equals(matrix.reduce([[1,1,1],[0,0,2],[0,0,3]]), [[1,1,0],[0,0,0],[0,0,1]]), true);
  });

  it('should throw an error if that single argument is not a valid matrix', function() {
    expect(() => matrix.reduce([])).to.throw('Invalid matrix');
  });

  it('should not alter the original argument', function() {
    let mat = [[1, 2, 3],[1, 2, 3]];
    let red = matrix.reduce(mat);
    assert.equal(equals(mat, [[1,2,3],[1,2,3]]), true);
  });
});

describe('#reduceAug', function() {
  // First arg: coeffs. Second arg: solutions.
  it('should return the concatenated RREF of an augmented matrix passed in two parts', function() {
    assert.equal(equals(matrix.reduceAug([[-2,1],[1,-4]], [[-3],[-2]]), [[1,0,2],[0,1,1]]), true);
  });

  it('should be able to handle solution matrices that are *not* just vectors', function() {
    assert.equal(equals(matrix.reduceAug([[0,1,1],[1,3,3]], [[1,2],[3,4]]), [[1,0,0,0,-2],[0,1,1,1,2]]), true);
    // Next case is equivalent to finding an inverse.
    matrix.setPrecision(2e-12);
    assert.equal(equals(matrix.reduceAug([[3,0,2],[2,0,-2],[0,1,1]], matrix.identity(3)),
      [[1,0,0,0.2,0.2,0],[0,1,0,-0.2,0.3,1],[0,0,1,0.2,-0.3,0]],
    true), true);
  });

  it('should not alter either of the original arguments', function() {
    let mat1 = [[1,2],[2,3]];
    let mat2 = [[1],[1]];
    let res = matrix.reduceAug(mat1, mat2);
    assert.equal(equals(mat1, [[1,2],[2,3]]), true);
    assert.equal(equals(mat2, [[1],[1]]), true);
  });

  it('should throw an error if the two arguments do not have the same number of rows', function() {
    expect(() => matrix.reduceAug([[1,2],[4,5],[3,2]], [[1,2,3],[4,3,2]]))
    .to.throw('Arguments must have the same number of rows');

    expect(() => matrix.reduceAug([[1,1],[2,3]], [[1],[2],[3]]))
    .to.throw('Arguments must have the same number of rows');
  });

  it('should throw an error if either argument is not a valid matrix', function() {
    expect(() => matrix.reduceAug('asdf', [[1],[2],[3]])).to.throw('Invalid matrix');
    expect(() => matrix.reduceAug([[1, 2],[1, 2]], {})).to.throw('Invalid matrix');
  });
});

describe('#scale', function() {
  it('should multiply each element of the passed matrix by the passed scalar.', function() {
    assert.equal(equals(matrix.scale([[1, 1, 2], [2, 3, 4]], 2), [[2, 2, 4], [4, 6, 8]]), true);
    assert.equal(equals(matrix.scale([[1, 1], [2, 3]], 0), [[0, 0], [0, 0]]), true);
    assert.equal(equals(matrix.scale([[0.4], [2]], 1.5), [[0.6], [3]], true), true);
    assert.equal(equals(matrix.scale([[3], [1], [0]], -1.3), [[-3.9], [-1.3], [0]], true), true);
  });

  it('should throw an error if the scalar is not a finite number.', function() {
    expect(() => matrix.scale([[1, 2], [1, 2]], NaN)).to.throw('Invalid scalar: must be a finite number');
    expect(() => matrix.scale([[1, 2], [1, 2]], Infinity)).to.throw('Invalid scalar: must be a finite number');
    expect(() => matrix.scale([[1, 2], [1, 2]], 'asdf')).to.throw('Invalid scalar: must be a finite number');
    expect(() => matrix.scale([[1, 2], [1, 2]], {})).to.throw('Invalid scalar: must be a finite number');
  });

  it('should throw an error if the passed matrix is not valid.', function() {
    expect(() => matrix.scale([[1], [1, 2]], 2)).to.throw('Invalid matrix');
    expect(() => matrix.scale({ 0: [1] }, 2)).to.throw('Invalid matrix');
    expect(() => matrix.scale(6, 2)).to.throw('Invalid matrix');
    expect(() => matrix.scale('', 2)).to.throw('Invalid matrix');
  });
});

describe('#solve', function() {
  it.skip('should expect the system to have two arguments, a coefficient matrix and a solution vector', function() {
    // Should this really be a test?
  });

  it('should return an array of solutions to the given system', function() {
    let precision = 2e-12;

    let coeffsOne = [[1,1],[0.09,0.11]];
    let solOne = [[12000],[1180]];
    let varValuesOne = [7000, 5000];
    let answerOne = matrix.solve(coeffsOne, solOne);
    for (let i = 0; i < answerOne.length; i++) {
      assert.equal(almostEquals(answerOne[i], varValuesOne[i], precision), true);
    }

    let coeffsTwo = [[3,-1,1],[2,-4,-1],[6,8,1]];
    let solTwo = [[-10],[20],[-100]];
    let varValuesTwo = [-6, -8, 0];
    let answerTwo = matrix.solve(coeffsTwo, solTwo);
    for (let i = 0; i < answerTwo.length; i++) {
      assert.equal(almostEquals(answerTwo[i], varValuesTwo[i], precision), true);
    }
  });

  it('should throw an error if the arguments do not have the same number of rows', function() {
    expect(() => matrix.solve([[1,1],[2,3]], [[1],[2],[3]]))
    .to.throw('Arguments must have the same number of rows');
  });

  it.skip('should throw an error if the "solution" argument is not in vector form', function() {

  });

  it('should throw an error if either argumment is not a valid matrix', function() {
    expect(() => matrix.solve({}, [[1],[2]])).to.throw('Invalid matrix');
    expect(() => matrix.solve([[1,2],[3,4]], x=>3*x)).to.throw('Invalid matrix');
  });
});

describe('#stack', function() {
  it('should return the vertical concatenation of A and B', function() {
    let m1 = [[1,2,3],[3,2,1]];
    let m2 = [[0,-1,-2]];
    let stacked = matrix.stack(m1, m2);
    let correct = [[1,2,3],[3,2,1],[0,-1,-2]];
    assert.equal(equals(stacked, correct), true);

    assert.equal(equals(matrix.stack([[1]], [[2],[3]]), [[1],[2],[3]]), true);
  });

  it('should not alter either argument', function() {
    let m1 = [[1,2]];
    let m2 = [[3,4],[5,6]];
    let stacked = matrix.stack(m1, m2);
    assert.equal(equals(m1, [[1, 2]]), true);
    assert.equal(equals(m2, [[3,4],[5,6]]), true);
  });

  it('should throw an error if the matrices do not have the same number of columns', function() {
    expect(() => matrix.stack([[1]], [[2,3]])).to.throw('Matrices must have the same number of columns');
  });

  it('should throw an error if either argument is not a valid matrix', function() {
    expect(() => matrix.stack({}, [[1,2],[0,-1]])).to.throw('Invalid matrix');
    expect(() => matrix.stack([[1,2,3],[0,-1,-2]], 'asdf')).to.throw('Invalid matrix');
  });
});

describe('#subtract', function() {
  it('should return the difference of the first and second matrices', function() {
    assert.equal(equals(matrix.subtract([[1, 2, 3],[4, 5, 6]], [[0, -1, 2],[3, -4, -5]]), [[1, 3, 1],[1, 9, 11]]), true);
    assert.equal(equals(matrix.subtract([[1, 2], [1, 2]], [[0, 2], [3, -4]]), [[1, 0], [-2, 6]]), true);
  });

  it('should throw an error if the two matrices do not have the same dimensions', function() {
    expect(() => matrix.subtract([[1, 2, 3], [1, 2, 3]], [[1, 2], [3, 4]])).to.throw('Matrices must have the same dimensions');
  });

  it('should throw an error if either matrix is invalid', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.subtract(INVALID_MATRICES[i], [[1, 2],[3, 4]])).to.throw('Invalid matrix');
    }
  });
});

describe('#transpose', function() {
  it('should transpose the given matrix (switch rows and columns)', function() {
    let mat = [[1, 2, 3], [2, 3, 4], [-1, 0, -2], [1, -3, -2]];
    let transposed = [[1, 2, -1, 1], [2, 3, 0, -3], [3, 4, -2, -2]];
    assert.equal(equals(matrix.transpose(mat), transposed), true);
  });

  it('should not alter the original argument', function() {
    let mat = [[1,2],[3,4],[5,6]];
    let tr = matrix.transpose(mat);
    assert.equal(equals(mat, [[1,2],[3,4],[5,6]]), true);
  });

  it('should throw an error if the argument is not a valid matrix', function() {
    expect(() => matrix.transpose([])).to.throw('Invalid matrix');
  });
});



/* Assertions */

describe('#equals', function() {
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

  it('should return whether or not two valid matrices are equal.', function() {
    assert.equal(equals(a, d), true);
    assert.equal(equals(b, b), true);
    assert.equal(equals(a, b), false);
    assert.equal(equals(a, e), false);
    assert.equal(equals(b, c), false);
  });

  it('should allow the user to specify whether or not to use near-equality (e.g., for comparing floats).', function() {
    assert.equal(equals([[1.1, 1]], [[1.100000000000001, 1]], true), true);
    assert.equal(equals([[1.1, 1]], [[1.100000000000001, 1]], false), false);
  });

  it('should avoid using near-equality by default.', function() {
    assert.equal(equals([[1.1, 1]], [[1.100000000000001, 1]]), false);
  })

  it('should throw an error if either matrix is invalid.', function() {
    expect(() => equals(a, i.a)).to.throw('Invalid matrix');
    expect(() => equals(b, i.b)).to.throw('Invalid matrix');
    expect(() => equals(c, i.c)).to.throw('Invalid matrix');
    expect(() => equals(d, i.d)).to.throw('Invalid matrix');
    expect(() => equals(e, i.e)).to.throw('Invalid matrix');
  });

  it('should use the value defined by #setPrecision to determine near-equality', function() {
    matrix.setPrecision(1e-3);
    assert.equal(equals([[1, 2.0001]], [[1, 2]], true), true);
    assert.equal(equals([[1, 2.01]], [[1, 2]], true), false);
  });
});

describe('#is2DArray', function() {
  it('should return whether the argument is an array of arrays.', function() {
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

describe('#isRectangular', function() {
  it('should return whether a two-dimensional array is rectangular.', function() {
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

describe('#isSquare', function() {
  it('should return whether a matrix is square.', function() {
    assert.equal(matrix.isSquare([[1, 2], [1, 2]]), true);
    assert.equal(matrix.isSquare([[1]]), true);
    assert.equal(matrix.isSquare([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), true);
    assert.equal(matrix.isSquare([[1, 2], [3, 4], [5, 6]]), false);
    assert.equal(matrix.isSquare([[1], [2]]), false);
  });

  it('should throw an error if the argument is not a valid matrix.', function() {
    for (let i = 0; i < INVALID_MATRICES.length; i++) {
      expect(() => matrix.isSquare(INVALID_MATRICES[i])).to.throw('Invalid matrix');
    }
  });
});

describe('#isValidMatrix', function() {
  it('should return whether or not the argument is a valid matrix.', function() {
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



/* Other methods */

describe('#copy', function() {
  it('should return a deep duplicate of the given matrix', function() {
    let mat = [[1, 2, 3], [4, 5, 6]];
    assert.equal(equals(mat, matrix.copy(mat)), true);
  });

  it('should prevent changes to the new (returned) matrix from affecting the original', function() {
    let first = [[1, 2], [3, 4]];
    let second = matrix.copy(first);
    second[0][0] = 2;
    assert.equal(first[0][0], 1);
    assert.equal(second[0][0], 2);
  });

  it('should throw an error if the argument is not a valid matrix', function() {
    expect(() => matrix.copy('asdf')).to.throw('Invalid matrix');
  });
});

describe('#disp', function() {
  describe.skip('should nicely display the given matrix', function() {
    // How does one test this?
    it('should add parentheses to the beginning and end of each line', function() {
      // Specify whitespace?
    });

    it('should add a pipe | between a main and augmented matrix', function() {

    });

    describe('should allot each entry as much space the longest entry will require', function(){
      it('should work if the longest entry in the main matrix', function() {

      });

      it('should work if the longest entry is in the augmentation', function() {

      });
    });
  });

  it.skip('should optionally take a second argument and display an augmented matrix', function() {

  });

  it('should throw an error if the main argument is not a valid matrix', function() {
    expect(() => matrix.disp([[1,2], 'asdf'])).to.throw('Invalid matrix');
  });

  it('should throw an error if the augmentation is not a valid matrix', function() {
    expect(() => matrix.disp([[1,2],[3,4]], [{}, 'asdf'])).to.throw('Invalid matrix');
  });

  it('should throw an error if the main and aug matrices have different numbers of rows', function() {
    expect(() => matrix.disp([[1,2],[3,4],[5,6]], [[1],[2],[3],[4]]))
    .to.throw('Multiple arguments must have the same number of rows');
  });
});

// NOTE: Tests for getPrecision and setPrecision are highly interdependent.
// Should I work to untangle them?
describe('#getPrecision', function() {
  it('should return the precision level for near-equality in #equals', function() {
    matrix.setPrecision(1e-14);
    assert.equal(matrix.getPrecision(), 1e-14);
  });
});

describe('#setPrecision', function() {
  it('should set the precision level, which should then be accessible with #getPrecision', function() {
    matrix.setPrecision(1e-9);
    assert.equal(matrix.getPrecision(), 1e-9);
  });

  it('should accept "default" as a valid argument that sets precision to 2e-15', function() {
    matrix.setPrecision('default');
    assert.equal(matrix.getPrecision(), 2e-15)
  });

  it('should throw an error if the argument is neither a finite number nor the string "default"', function() {
    expect(() => matrix.setPrecision('asdf')).to.throw('Input to setPrecision must be a finite number or "default"');
    expect(() => matrix.setPrecision(Infinity)).to.throw('Input to setPrecision must be a finite number or "default"');
    expect(() => matrix.setPrecision()).to.throw('Input to setPrecision must be a finite number or "default"');
  });

  it('should return the new precision value once it has been set', function() {
    assert.equal(matrix.setPrecision(1e-13), 1e-13);
    assert.equal(matrix.setPrecision('default'), 2e-15);
  })
});



/* Elements subclass */

describe('Matrix.elements', function() {
  it('should be an object', function() {
    assert.equal(typeof matrix.elements, 'object');
  });

  it('should have methods', function() {
    // Does it have at least one method?
    assert.equal(true, Object.keys(matrix.elements).some(function(key) {
      return typeof matrix.elements[key] === 'function';
    }));
  });

  describe('#multiply', function() {
    it('should return a new matrix where entry i,j is the product of the i,jth entries of the arguments', function() {
      let m1 = [[1, 3, 5],[-1, 0, 3],[2, 4, 1],[3, -3, -1]];
      let m2 = [[0, -1, 3.5],[-1.2, 2, 1],[1, 12, 3],[-2, -2, -1.3]];
      let correct = [[0, -3, 17.5],[1.2, 0, 3],[2, 48, 3],[-6, 6, 1.3]];
      assert.equal(true, equals(matrix.elements.multiply(m1, m2), correct, true));
    });

    it('should throw an error if either matrix is not valid', function() {
      expect(() => matrix.elements.multiply('asdf', [[1,2],[2,1]])).to.throw('Invalid matrix');
      expect(() => matrix.elements.multiply([[1,2],[3,4]], {})).to.throw('Invalid matrix');
    });

    it('should throw an error if the matrices have different dimensions', function() {
      let m1 = [[1,2,3],[4,5,6]];
      let m2 = [[1,2],[3,4],[5,6]];
      expect(() => matrix.elements.multiply(m1, m2)).to.throw('Matrices must have the same dimensions');
    });

    it('should not alter either original argument', function() {
      let m1 = [[1],[2],[3],[4]];
      let m2 = [[2],[1],[0],[-1]];
      let res = matrix.elements.multiply(m1, m2);
      assert.equal(true, equals(m1, [[1],[2],[3],[4]]));
      assert.equal(true, equals(m2, [[2],[1],[0],[-1]]));
    });
  });

  describe('#divide', function() {
    it('should return a new matrix where entry i,j is the quotient of the i,jth entries of the arguments', function() {
      let m1 = [[1,2,-3.4],[1.2,-1,0]];
      let m2 = [[-2,1,4],[3,-0.2,1]];
      let res = matrix.elements.divide(m1, m2);
      let correct = [[-0.5,2,-0.85],[0.4,5,0]];
      assert.equal(true, equals(res, correct, true));
    });

    it.skip('should throw an error if the matrix of divisors contains any zeros', function() {

    });
  });
});
