# TODO items completed with each version

### v1.1.0 (published)

- [x] In test.js, put error messages in constants or an object for consistency and reuse.

    * Possibly define a `Matrix.errors` object for this?

    * Use for matrix.js as well

- [x] elements#power(mat, pow): element-by-element exponentiation

- [x] Possibly move errors to a different file to avoid clutter?

- [x] Add a #ones method.

- [x] Modify #add to take an arbitrary number of arguments (greater than two).

- [x] Make "number of arguments" error in #add reusable.

- [x] Modify #subtract to take an arbitrary number of arguments (greater than two).

### v1.0.5 (published)

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

- [x] elements#divide(mat1, mat2): element-by-element division

- [x] Write docs for elements#divide.

### v1.0.4 (published)

- [x] Consider using #reduce inside #inverse somehow so you aren't repeating code?

- [x] Create a /example directory with example scripts.

- [x] Add a #solve method.

- [x] Update `solving.js` example script to use #solve.

- [x] Add documentation for #solve.

- [x] Test possible dimension errors in #reduceAug.

    * What happens when I concatenate two matrices that shouldn't be concatenated?
    That is, they wouldn't form a nice augmented matrix.

    * For example, [[1,2],[3,4]] and [[1,2]]

- [x] Fix #equals hack in the tests for #solve.

- [x] Add a method to generate a random matrix (between 0 and 1, I guess?).

- [x] Figure out a way to test the output of #random.

### v1.0.3 (published)

- [x] Add support in #inverse and #reduce(Aug) for row switching, rows that have all zeros. See test case 1 for #reduce.

- [x] Add an example to the docs for #reduce?

- [x] Refactor so that all functions are in matrix.js.

    * Definitely change the version if/when you do this, just for practice if nothing else.

    * Avoids having to `require` the assertion functions to validate input, etc.

    * Keep assertion methods user-accessible somehow.

### v1.0.1

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
