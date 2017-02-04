# Matrix-Ops: JS Matrix Operations

## Table of Contents
<!-- TODO: Generate TOC -->

Is there some way to auto-generate this stuff?
Without writing a script myself, that is?
StackOverflow says yes.

## About Testing

I'm using Mocha with Chai to create the test suite for this project.
It's been my first real foray into TDD, which seems to be working fairly well.

# Documentation

## Matrixes.elements

These methods perform element-by-element arithmetic operations on matrices.
As a general rule, if a #elements method takes matrix arguments,
all of those matrices must have the same dimensions.

### matrixes.elements.divide(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the matrix that results from element-by-element division
of `matrixOne` and `matrixTwo`.

Note that no entry in `matrixTwo` can be equal to zero.
This would result in division by zero, which would yield a matrix containing `Infinity`.
This isn't considered valid in this library.

Throws an error if the matrices have different dimensions
or if either matrix is not valid.

### matrixes.elements.multiply(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the matrix that results from element-by-element multiplication
of `matrixOne` and `matrixTwo`.

For example:

```javascript

let A = matrixes.createMatrix("1 2, 3 4");
let B = matrixes.createMatrix("0 1, -1 -4");

let elementMultiply = matrixes.elements.multiply(A, B);
console.log(elementMultiply); // => [[0, 2], [-3, -16]]

let C = matrixes.createMatrix("1 2 3, 4 5 6");
console.log(matrixes.elements.multiply(A, C));
// => Unequal dimensions; throws an error

// Compare to normal matrix multiplication
let normalMultiply = matrixes.multiply(A, B);
console.log(normalMultiply); // => [[-2, -7], [-4, -13]]

```

Throws an error if the matrices have different dimensions
or if either matrix is not valid.

###  matrixes.elements.power(matrix, power)

- matrix: <Matrix>
- power: <Number> (not Infinity, not NaN)

Returns a new matrix where each entry i,j from the original matrix
has been raised to the power `power` and placed in entry i,j of the new matrix.

Throws an error if the given matrix is invalid
or if the given power is not a real, finite number.
The power cannot be `Infinity` or `NaN`.

## Main Methods

### matrixes.add(matrixOne, matrixTwo, ...)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>
- ... (Arbitrary number of Matrix arguments)

Returns the matrix sum of all matrices passed in.
This function must take *at least* two arguments.
Doesn't alter any of the arguments.

Throws an error if the matrices do not have the same dimensions or if any matrix is invalid.

### matrixes.augment(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the matrix formed by augmenting `matrixOne` with `matrixTwo`.
That is, it takes each column from `matrixTwo` and tacks it onto the end of `matrixOne`.

Throws an error if the matrices have different numbers of rows
or if either matrix isn't valid.

### matrixes.copy(matrix)

- matrix: <Matrix>

Returns a copy of the given matrix.
Changing this copy will *not* change the original matrix.
The two will be separate and won't reference each other.

Throws an error if the argument is not a valid matrix.

### matrixes.createMatrix(matrixString)

- matrixString: <String>

Returns a two-dimensional rectangular matrix with numerical entries (array of arrays).

Creates a matrix from a user-defined string. Matrices *must* be rectangular.
Entries must be numerical, or at least able to coerce (using `parseFloat`) to a numerical value that is not NaN.
Scientific notation is supported.
<!--Fractions, scientific notation, and mathematical expressions are all supported.-->

<!--
For example, the following code creates a valid matrix:

```javascript

let matrixString = '9/8 4/5, 1 3.00, 1e3 (4-2)*(-1)';
let result = matrixes.createMatrix(matrixString);
console.log(result); // => [[1.125, 0.8], [1, 3], [1000, -2]]

```
-->

Matrices are encoded as arrays of arrays.

matrixString should fit one of the following patterns:

- "1 2 3, 4 5 6, 7 8 9"
- "1 2 3,4 5 6,7 8 9"

All of the above options will create the matrix `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`.

### matrixes.det(matrix)

- matrix: <Matrix>

Returns the determinant of the given matrix.
Throws an error if the matrix is not square (because a matrix must be square to take a determinant)
or if the argument isn't a valid matrix.

### matrices.disp(matrix [, augmentation])

- matrix: <Matrix>
- augmentation: <Matrix>

Pretty-prints the given matrix to the console/terminal.
If `augmentation` is given, `disp` prints an augmented matrix
where `matrix` is augmented with `augmentation`.

### matrixes.equals(matrixOne, matrixTwo [, useNearEquality])

- matrixOne: <Matrix>
- matrixTwo: <Matrix>
- useNearEquality: <Boolean>

Returns a boolean: `true` if the two matrices are equal, `false` otherwise.

For the sake of this project, the two matrices are equal if:

- Their dimensions are equal.

- All of their entries are equal.

- Both matrices are valid.

If `useNearEquality` is set to true, `equals` will compare the matrices at a level of precision lower than that of standard JavaScript ===.
By default, if `useNearEquality` is true, entries can differ by up to 2e-15 and still be considered equal.
That threshold is arbitrary, but it's roughly one order of magnitude higher than the typical tolerance of ===.
This compensates for the fact that many operations on floating-point numbers will introduce an error larger than what JavaScript === will allow.

The user can set a new level of precision/tolerance for near-equality using `matrixes.setPrecision`.
The user can also call `matrixes.getPrecision` to return the current precision level.

`useNearEquality` defaults to `false`if not specified.

For example:

```javascript

console.log(1.0000000000000005 === 1) // => false

let A = matrixes.createMatrix("1.0000000000000005");
let B = matrixes.createMatrix("1");

console.log(matrixes.equals(A, B, true)); // => true
console.log(matrixes.equals(A, B)); // => false

// JavaScript doesn't operate with this much precision for values >= 1 ?
let C = createMatrix("1.0000000000000001"); // 1 + 1e-16
console.log(C); // => [ [ 1 ] ]
console.log(matrixes.equals(B, C)); // => true

```

### matrixes.getPrecision()

Returns the level of precision that will be used for testing near-equality in `matrixes.equals`.
The user can alter this level using matrixes.setPrecision(newPrecision).

If no precision is set beforehand, this value defaults to 2e-15.
<!-- TODO: Add link to #setPrecision here -->

### matrixes.identity(size)

- size: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns the identity matrix with dimensions `size` by `size`.
By definition, the identity matrix has ones down the main diagonal and zeros for all other entries.

For example:

```javascript

let a = matrixes.identity(2);
// [[1, 0], [0, 1]]

let b = matrixes.identity(2.000);
// [[1, 0], [0, 1]]

let c = matrixes.identity(4.23);
// Throws an error.

let d = matrixes.identity(Infinity);
// Throws an error.

```

### matrixes.inverse(matrix)

- matrix: <Matrix>

Returns the inverse matrix of the given matrix.
Does not alter the original argument.

Throws an error if:

- The given matrix is not valid.

- The given matrix is not square (and therefore is not invertible).

- The given matrix is singular (square but not invertible => the determinant is 0).

### matrixes.is2DArray(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix (or not-matrix, as the case may be) is an array of arrays, `false` if not.

Note that this method *doesn't* check if the matrix is rectangular.
It's used for verifying whether or not a matrix can be passed to methods that assume it will be an array of arrays.

None of the arguments in the first/outer-level array can be anything but arrays;
none of the elements in the second/inner-level arrays can be objects according to `typeof`.
I.e., if `typeof matrix[i][j] === 'object'`, the argument is not a 2D array.

### matrixes.isRectangular(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is rectangular, `false` if it isn't.

The argument must be a two-dimensional array according to `matrixes.is2DArray`.
Because that's the only requirement, many invalid matrices will result in a `true` return value here.

For example:

```javascript

let a = [
  [1, NaN],
  ['asdf', Infinity],
  [() => 'yep, this is a function', 2]
];

let doesItWork = matrixes.isRectangular(a);
// doesItWork === true

```

There's definitely some strange behavior that can go on here.
Because of that, it's primarily used just for checking dimensions.

### matrixes.isSquare(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is rectangular, `false` if it isn't.

### matrixes.isValidMatrix(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is valid, `false` if it isn't.

Conditions for a valid matrix:

- Matrix must be an array of arrays (exactly two-dimensional).

- Matrix dimensions should be greater than or equal to 0.
This means that `[[]]` is *not* a valid matrix, but `[[1]]` is.

- Matrix must be rectangular.

- All entries must be finite numbers (i.e., not Infinity and not NaN).

### matrixes.multiply(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the matrix product `matrixOne` * `matrixTwo`.

Throws an error if either matrix is invalid or if the two matrices cannot be multiplied due to their dimensions.
To be multipliable, `matrixOne` must have dimensions *m x n* and `matrixTwo` must have dimensions *n x p*.
(For any positive, nonzero integers m, n, and p.)

### matrixes.ones(numRows, numColumns)

- numRows: <Integer> *or* a float, double, etc. that is equivalent to an integer
- numColumns: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns a matrix of ones of the size `numRows` by `numColumns`.

Throws an error if either `numRows` or `numColumns`
is not an integer strictly greater than 0.

### matrixes.random(numRows, numColumns)

- numRows: <Integer> *or* a float, double, etc. that is equivalent to an integer
- numColumns: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns a random matrix of the size `numRows` by `numColumns`.
All entries will be between 0 (inclusive) and 1 (exclusive).

Both numRows and numColumns must be integers strictly greater than 0.

### matrixes.reduce(matrix)

- matrix: <Matrix>

Returns the reduced row echelon form (RREF) of the given matrix.
Treats the matrix as if it were a coefficient matrix; i.e., the last column will also be reduced.

You could think of this as reducing the coefficient matrix of a homogeneous system.
Or just of any system where you're only looking at the coefficients.
I'm just going to stop typing now.

Throws an error if the argument is not a valid matrix.

Here's an example of using `matrixes.reduce`:

```javascript

let A = matrixes.createMatrix("1 2 3, 0 1 1, 1 2 3");

let reduced = matrixes.reduce(A);
console.log(reduced); // => [ [1, 0, 1], [0, 1, 1], [0, 0, 0] ]
// reduced is the RREF of matrix A.

```

### matrixes.reduceAug(coefficients, solutions)

- coefficients: <Matrix>
- solutions: <Matrix>

Returns the augmented matrix made by adjoining `coefficients` and `solutions`, then reducing.
Note that `solutions` does not necessarily have to be a vector.
For example, it could be an identity matrix, and you could reduce to find an inverse using #reduceAug.

Here's an example of using `matrixes.reduceAug`:

```javascript

let coeffs = matrixes.createMatrix("-2 1, 1 -4");
let solutions = matrixes.createMatrix("-3, -2");

let reduced = matrixes.reduceAug(coeffs, solutions);
console.log(reduced); // => [ [1, 0, 2], [0, 1, 1] ]

```

Concatenation occurs as follows:

```javascript

[[1,2],[3,4]] + [[0],[0]] => [[1,2,0],[3,4,0]];

/* Equivalent to the following augmented matrix:

(1 2 | 0)
(3 4 | 0)

*/

```

### matrixes.scale(matrix, scalar)

- matrix: <Matrix>
- scalar: <Number>

Returns a matrix equal to `matrix` scaled by `scalar`.
That is, it returns a matrix `newMatrix` such that each `newMatrix[i][j]` is equal to `matrix[i][j] * scalar`.

Note that this *doesn't* alter the passed matrix, it returns a new one instead.

### matrixes.setPrecision(newPrecision)

- newPrecision: <Number> *or* "default"

Sets a new precision for determining near-equality in matrixes.equals.
Also *returns* the new precision that the user just set.

Calling `matrixes.setPrecision("default")` sets the precision level to 2e-15.

`newPrecision` must be either the string "default" or a finite number (not NaN).

### matrixes.solve(coefficients, solutions)

- coefficients: <Matrix>
- solutions: <Matrix> : should be a 1-by-n or n-by-1 matrix (a vector)

Returns an array of the solutions to the given system of equations.
The system is represented by the augmented matrix formed with the `coefficients`
matrix on one side and the `solutions` vector on the other.

See the example script `solving.js` to see this function in action.
That script essentially shows the following:

```javascript

/* The following system of equations:
-2*x + y = -3
x - 4*y = -2

Becomes this augmented matrix:
(-2 1 | -3)
(1 -4 | -2)

*/

let coeffs = [[-2,1],[1,-4]];
let solns = [[-3],[-2]]; // Column vector

console.log(matrixes.solve(coeffs, solns)); // => [ 2 , 1 ]

```

### matrixes.subtract(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>
- ... (Arbitrary number of Matrix arguments)

Returns the matrix created by subtracting each successive matrix
(starting with the second) from the first.
The result is equivalent to `arguments[0] - sum(arguments[1], arguments[2], ...)`.
This function must take *at least* two arguments.
Doesn't alter any of the arguments.

Throws an error if the matrices do not have the same dimensions or if any matrix is invalid.

### matrixes.stack(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the vertical concatenation of `matrixOne` and `matrixTwo`.
That is, it tacks the rows of `matrixTwo` onto the bottom of `matrixOne`

Throws an error if the two matrices have different numbers of columns
or if either matrix isn't valid.

### matrixes.transpose(matrix)

- matrix: <Matrix>

Returns the transposition of the given matrix.
That is, it swaps the rows of said matrix with its columns.

For example:

```javascript

let original = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

let transposed = matrixes.transpose(original);

console.log(tranposed);

/* Logs the following:
[ [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9] ]
*/

```

Throws an error if the matrix isn't valid.

### matrixes.zeros(numRows, numColumns)

- numRows: <Integer> *or* a float, double, etc. that is equivalent to an integer
- numColumns: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns a zero matrix of the size `numRows` by `numColumns`.

Both numRows and numColumns must be integers strictly greater than 0.
