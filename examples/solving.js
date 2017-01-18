const matrixes = require('matrixes');

/** Consider the following system:
 * -2*x + y = -3
 *  x - 4*y = -2
 * What are the values of x and y?
 */

let coeffs = matrixes.createMatrix('-2 1, 1 -4');
let solutions = matrixes.createMatrix('-3, -2');

// Find the variable values that solve the system.
let values = matrixes.solve(coeffs, solutions);
console.log(values); // => [ 2 , 1 ]

// So x = 2, y = 1
