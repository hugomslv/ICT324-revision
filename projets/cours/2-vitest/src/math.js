/**
 * @file math.js is a file that contains functions for basic math operations.
 * @module math
 * @see {@link https://git.s2.rpn.ch}
 * @author Pierre Ferrari <pierre.ferrari@rpn.ch>
 * @version 1.0.0
 * @license
 * Copyright [2024] [Pierre Ferrari <pierre.ferrari at rpn.ch>]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Add two numbers.
 * @author Pierre Ferrari <pierre.ferrari@rpn.ch>
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number|string} The sum of the two numbers or 'error'.
 */
export function add(a, b) {
    if (typeof(a)  !== 'number' || typeof(b)  !== 'number') {
        return 'error'
    }
    return a + b
}

/**
 * Subtract two numbers.
 * @author Pierre Ferrari <pierre.ferrari@rpn.ch>
 * @param {number} a 
 * @param {number} b 
 * @returns {number|string} The difference of the two numbers or 'error'.
 */
export function sub(a, b) {
    if (typeof(a)  !== 'number' || typeof(b)  !== 'number') {
        return 'error'
    }
    return a - b
}

/**
 * Rotate an array by n positions.
 * @author Pierre Ferrari <pierre.ferrari@rpn.ch>
 * @param {Array<number>} arr - The array to rotate.
 * @param {number} n - The number of positions to rotate.
 * @returns {Array<number>|string} The rotated array or 'error'.
 */
export function rotate(arr, n) {
    if (!Array.isArray(arr)) {
        return 'error'
    }
    if (n === undefined || typeof(n) !== 'number') {
        n = 1
    }
    for(let i = 0; i < arr.length; i++) {
        if (typeof(arr[i]) !== 'number') {
            return 'error'
        }
    }
    return arr.slice(n).concat(arr.slice(0, n))
}