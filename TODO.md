# TODO list

- [x] Make project structure more maintainable.

- [x] Create documentation for the stuff you've already written.

- [x] Add a #isValidMatrix(Matrix matrix) method. This is probably extremely important for avoiding/handling errors.

    * [x] Added #is2DArray(Matrix matrix) method to help with this.

- [x] Add a #equals(Matrix matrixOne, Matrix matrixTwo) method to assert whether two matrices are equivalent.

    * Also going to come in handy for my own testing.

- [x] Beef out tests. Testing information at https://mochajs.org

- [x] Add a #identity(int size) method to return an identity matrix of user defined size.

- [x] Add a #zeros(int rows, int columns) method to return a rectangular matrix of zeros.

- [x] Make initial commit and push to remote GitHub repository.

- [x] Make repository viewable on GitHub Pages using the /docs directory.

    * Pull those changes back down.

- [x] Add a #scale(Matrix matrix, Number scalar) method to multiply a matrix by a constant (scalar).

    * Had to alter #equals to account for the inconsistency of floating-point equality.

- [x] Allow user to decide whether or not to use near equality for #equals.

- [x] Add getPrecision and setPrecision methods for #equals near-equality precision.

- [x] Allow user to set the precision of the near equality checks in #equals.

- [x] Improve tests for #multiply. Add tests for error handling capabilities.

- [x] Add a #add method.

- [x] Add a #subtract method.

- [x] Add a #inverse method to find the inverse of a matrix.

    * [x] Added a #copy method to allow deep duplication of matrices.

        - Allows the inverse operation to avoid modifying its argument.

- [x] Add docs for #copy and #inverse.

- [x] Add a #det(Matrix matrix) method to find the determinant of a given matrix.

- [x] Add #reduce methods. Support both regular and augmented matrices.

    * Actually, you already implemented a general RREF algorithm to make the #inverse method.

    * [x] #reduce

    * [x] #reduceAug

### v1.0.1

- [x] Add support in #inverse and #reduce(Aug) for row switching, rows that have all zeros. See test case 1 for #reduce.

- [x] Add an example to the docs for #reduce?

- [x] Refactor so that all functions are in matrix.js.

    * Definitely change the version if/when you do this, just for practice if nothing else.

    * Avoids having to `require` the assertion functions to validate input, etc.

    * Keep assertion methods user-accessible somehow.

### Published v1.0.3

- [x] Consider using #reduce inside #inverse somehow so you aren't repeating code?

- [x] Create a /example directory with example scripts.

- [x] Add a #solve method.

- [x] Update `solving.js` example script to use #solve.

- [x] Add documentation for #solve.

- [x] Test possible dimension errors in #reduceAug.

    * What happens when I concatenate two matrices that shouldn't be concatenated?
    That is, they wouldn't form a nice augmented matrix.

    * For example, [[1,2],[3,4]] and [[1,2]]

- [ ] Fix #equals hack in the tests for #solve.

- [ ] Add a method to generate a random matrix (between 0 and 1, I guess?).

- [ ] Add more example scripts.

- [ ] Allow add, subtract, and multiply to take any number of arguments?

- [ ] Optimize #inverse and #det methods?

- [ ] Consider moving completed items in TODO to a CHANGELOG file.

- [ ] Try to DRY up the tests a little bit when testing things like error handling and invalid arguments.

- [ ] Consider adding methods that alter the argument in place.

    * These might be best as methods on `matrix.prototype` rather than on `matrix` itself.

    * I.e., usage would be `A.scale(2)` (doubles A without creating a new matrix) vs. `B = matrix.scale(A, 2);` (creates a new matrix that is double matrix A).

- [ ] Add support for math expressions in #createMatrix. Avoid using `eval`.

    * Reflect this change in the docs when you make it.

    * Test cases:

        1. `assert.equal(equals(matrix.createMatrix('1*6 2-3*4, 3+(5%1)*4 (4-2)*(-1)'), [[6, -10], [3, -2]]), true);`

        2. `assert.equal(equals(matrix.createMatrix('9/8 4/5, 1 3.00, 1e3 (4-2)*(-1)'), [[1.125, 0.8], [1, 3], [1000, -2]]), true);`

        3. `assert.equal(equals(matrix.createMatrix('9/8, 1/2, 3/4'), [[1.125],[0.5],[0.75]]), true);`

- [ ] Generate table of contents for the documentation (with internal links).

- [ ] Consider populating the package.json `directories` property more fully. See https://docs.npmjs.com/files/package.json.

- [ ] Add test cases to a .npmignore file, or figure out the accepted way to prevent these from being part of the package (assuming that's desired).
