const matrixes = require('matrixes');

/** Consider the following system:
 * -2*x + y = -3
 *  x - 4*y = -2
 * What are the values of x and y?

 */
let coeffs = matrixes.createMatrix('-2 1, 1 -4');
let solutions = matrixes.createMatrix('-3, -2');

let reduced = matrixes.reduceAug(coeffs, solutions);
console.log(reduced); // => [ [1, 0, 2], [0, 1, 1] ]

let solutions = {
  x: reduced[0][reduced[0].length - 1],
  y: reduced[1][reduced[0].length - 1]
};
console.log(solutions);
// => { x: 2, y: 1 }
