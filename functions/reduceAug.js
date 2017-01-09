const isValidMatrix = require('./isValidMatrix.js');
const copy = require('./copy.js');

function reduceAug(inputOne, inputTwo) {
  if (!isValidMatrix(inputOne) || !isValidMatrix(inputTwo)) throw new Error('Invalid matrix');
  let coeffs = copy(inputOne);
  let solutions = copy(inputTwo);
}

module.exports = reduceAug;
