module.exports = (function() {
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
