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

### matrix.createMatrix(matrixString)

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
let result = matrix.createMatrix(matrixString);
console.log(result); // => [[1.125, 0.8], [1, 3], [1000, -2]]

```
-->

Matrices are encoded as arrays of arrays.

matrixString should fit one of the following patterns:

- "1 2 3, 4 5 6, 7 8 9"
- "1 2 3,4 5 6,7 8 9"

All of the above options will create the matrix `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`.

### matrix.equals(matrixOne, matrixTwo [, useNearEquality])

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
That threshold is arbitrary, but roughly one order of magnitude higher than the typical tolerance of ===.
This compensates for the fact that many operations on floating-point numbers will introduce an error larger than what JavaScript === will allow.

`useNearEquality` defaults to `false`if not specified.

For example:

```javascript

console.log(1.0000000000000005 === 1) // => false

let A = matrix.createMatrix("1.0000000000000005");
let B = matrix.createMatrix("1");

console.log(matrix.equals(A, B, true)); // => true
console.log(matrix.equals(A, B)); // => false

// JavaScript doesn't operate with this much precision for values >= 1 ?
let C = createMatrix("1.0000000000000001"); // 1 + 1e-16
console.log(C); // => [ [ 1 ] ]
console.log(matrix.equals(B, C)); // => true

```

### matrix.identity(size)

- size: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns the identity matrix with dimensions `size` by `size`.
By definition, the identity matrix has ones down the main diagonal and zeros for all other entries.

For example:

```javascript

let a = matrix.identity(2);
// [[1, 0], [0, 1]]

let b = matrix.identity(2.000);
// [[1, 0], [0, 1]]

let c = matrix.identity(4.23);
// Throws an error.

let d = matrix.identity(Infinity);
// Throws an error.

```

### matrix.is2DArray(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix (or not-matrix, as the case may be) is an array of arrays, `false` if not.

Note that this method *doesn't* check if the matrix is rectangular.
It's used for verifying whether or not a matrix can be passed to methods that assume it will be an array of arrays.

None of the arguments in the first/outer-level array can be anything but arrays;
none of the elements in the second/inner-level arrays can be objects according to `typeof`.
I.e., if `typeof matrix[i][j] === 'object'`, the argument is not a 2D array.

### matrix.isRectangular(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is rectangular, `false` if it isn't.

The argument must be a two-dimensional array according to `matrix.is2DArray`.
Because that's the only requirement, many invalid matrices will result in a `true` return value here.

For example:

```javascript

let a = [
  [1, NaN],
  ['asdf', Infinity],
  [() => 'yep, this is a function', 2]
];

let doesItWork = matrix.isRectangular(a);
// doesItWork === true

```

There's definitely some strange behavior that can go on here.
Because of that, it's primarily used just for checking dimensions.

### matrix.isSquare(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is rectangular, `false` if it isn't.

### matrix.isValidMatrix(matrix)

- matrix: <Matrix>

Returns a boolean: `true` if the matrix is valid, `false` if it isn't.

Conditions for a valid matrix:

- Matrix must be an array of arrays (exactly two-dimensional).

- Matrix dimensions should be greater than or equal to 0.
This means that `[[]]` is *not* a valid matrix, but `[[1]]` is.

- Matrix must be rectangular.

- All entries must be finite numbers (i.e., not Infinity and not NaN).

### matrix.multiply(matrixOne, matrixTwo)

- matrixOne: <Matrix>
- matrixTwo: <Matrix>

Returns the matrix product `matrixOne` * `matrixTwo`.

Throws an error if the two matrices cannot be multiplied (mathematically speaking).
Also errors if either matrix is non-rectangular.

### matrix.scale(matrix, scalar)

- matrix: <Matrix>
- scalar: <Number>

Returns a matrix equal to `matrix` scaled by `scalar`.
That is, it returns a matrix `newMatrix` such that each `newMatrix[i][j]` is equal to `matrix[i][j] * scalar`.

Note that this *doesn't* alter the passed matrix, it returns a new one instead.

### matrix.zeros(numRows, numColumns)

- numRows: <Integer> *or* a float, double, etc. that is equivalent to an integer
- numColumns: <Integer> *or* a float, double, etc. that is equivalent to an integer

Returns a zero matrix of the size `numRows` by `numColumns`.

Both numRows and numColumns must be integers strictly greater than 0.
