# TODO list

- [x] Consider moving completed items in TODO to a CHANGELOG file.

- [x] Add a #transpose method.

- [x] Add a #augment (horizontal concat) method.

- [x] Add a #stack (vertical concat) method.

- [x] Add docs for #transpose, #augment, and #stack.

- [x] Add a #disp method that prints matrices nicely.

- [x] Add docs for #disp.

- [x] Improve #disp method appearance.

- [x] Add Matrix.elements object (subclass?) to hold methods for elemental operations

- [x] elements#multiply(mat1, mat2): element-by-element multiplication

- [ ] elements#divide(mat1, mat2): element-by-element division

- [ ] elements#power(mat, pow): element-by-element exponentiation

- [ ] Test systems with free variables and no solutions in #solve.

- [ ] Figure out how to test #disp.

- [ ] Add more example scripts.

- [ ] Allow add, subtract, and multiply to take any number of arguments?

- [ ] Optimize #inverse and #det methods?

- [ ] Try to DRY up the tests a little bit when testing things like error handling and invalid arguments.

- [ ] Consider adding methods that alter the argument in place.

    * These might be best as methods on `matrix.prototype` rather than on `matrix` itself.

    * I.e., usage would be `A.scale(2)` (doubles A without creating a new matrix)
      vs. `B = matrix.scale(A, 2);` (creates a new matrix that is double matrix A).

    * disp, add, scale, subtract, multiply, reduce (?),
      det, inverse, transpose, "is (something)" assertions...

- [ ] Add support for math expressions in #createMatrix. Avoid using `eval`.

    * Reflect this change in the docs when you make it.

    * Test cases:

        1. `assert.equal(equals(matrix.createMatrix('1*6 2-3*4, 3+(5%1)*4 (4-2)*(-1)'), [[6, -10], [3, -2]]), true);`

        2. `assert.equal(equals(matrix.createMatrix('9/8 4/5, 1 3.00, 1e3 (4-2)*(-1)'), [[1.125, 0.8], [1, 3], [1000, -2]]), true);`

        3. `assert.equal(equals(matrix.createMatrix('9/8, 1/2, 3/4'), [[1.125],[0.5],[0.75]]), true);`

- [ ] Generate table of contents for the documentation (with internal links).

- [ ] Consider populating the package.json `directories` property more fully. See https://docs.npmjs.com/files/package.json.

- [ ] Add test cases to a .npmignore file, or figure out the accepted way to prevent these from being part of the package (assuming that's desired).
