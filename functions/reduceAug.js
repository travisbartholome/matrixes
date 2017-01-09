const isValidMatrix = require('./isValidMatrix.js');
const copy = require('./copy.js');
const reduce = require('./reduce.js');

function reduceAug(inputOne, inputTwo) {
  if (!isValidMatrix(inputOne) || !isValidMatrix(inputTwo)) throw new Error('Invalid matrix');
  let matrix = copy(inputOne).map((row, index) => row.concat(inputTwo[index].slice(0)));
  return reduce(matrix);
}

module.exports = reduceAug;
