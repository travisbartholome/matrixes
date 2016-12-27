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

module.exports = zeros;
