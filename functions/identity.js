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

module.exports = identity;
