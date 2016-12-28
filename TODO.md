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

- [ ] Allow user to decide whether or not to use near equality for #equals.

- [ ] Allow user to set the precision of the near equality checks in #equals.

- [ ] Add a #inverse method to find the inverse of a matrix.

- [ ] Try to DRY up the tests a little bit when testing things like error handling and invalid arguments.

- [ ] Refactor so that all functions are in matrix.js.

    * Definitely change the version if/when you do this, just for practice if nothing else.

    * Avoids having to `require` the assertion functions to validate input, etc.

    * Keep assertion methods user-accessible somehow.

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

- [ ] Create a /example directory with example scripts.

- [ ] Consider populating the package.json `directories` property more fully. See https://docs.npmjs.com/files/package.json.

- [ ] Add test cases to a .npmignore file, or figure out the accepted way to prevent these from being part of the package (assuming that's desired).
