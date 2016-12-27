const isRectangular = require('./isRectangular.js');

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

module.exports = createMatrix;
