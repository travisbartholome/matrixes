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

module.exports = is2DArray;
