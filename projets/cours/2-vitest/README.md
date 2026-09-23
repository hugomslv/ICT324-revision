# Module `math.js`

This module provides a set of mathematical functions.

## Functions

### `add(a, b)`
Returns the sum of `a` and `b`.

### `sub(a, b)`
Returns the difference between `a` and `b`.

## Installation

Nothing special to do, just import the module and use it.

## Usage

```javascript
import { add, sub } from 'math.js';

console.log(add(1, 2)); // 3

console.log(sub(1, 2)); // -1
```

## License

Apache-2.0

## Author

Pierre Ferrari

## Website

[Gitlab CPNE](https://git.s2.rpn.ch)

## Generate

```bash
$ npm i jsdoc
$ ./node_modules/.bin/jsdoc -c jsdoc-conf.json --readme README.md math.js
```