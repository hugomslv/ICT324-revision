import { add, sub, rotate } from './src/math.js'
import { test, expect } from 'vitest'

test('[add] expect the result of 1 + 2 to be 3', () => {
  expect(add(1, 2)).toBe(3)
})

test('[add] expect the result of -1 + -0 to be -1', () => {
  expect(add(-1, -0)).toBe(-1)
})

test('[add] expect the result of -1.0 + 1.0 to be 0', () => {
  expect(add(-1.0, 1.0)).toBe(0)
})

test('[add] expect the result of 1 + \'a\' to be an error', () => {
  expect(add(1, 'a')).toBe('error')
})

test('[add] expect the result of \'a\' + [1] to be an error', () => {
  expect(add('a', [1])).toBe('error')
})

test('[sub] expect the result of 1 - 2 to be -1', () => {
  expect(sub(1, 2)).toBe(-1)
})

test('[sub] expect the result of -1 - -0 to be -1', () => {
  expect(sub(-1, -0)).toBe(-1)
})

test('[sub] expect the result of -1.0 - 1.0 to be -2', () => {
  expect(sub(-1.0, 1.0)).toBe(-2)
})

test('[sub] expect the result of 1 + \'a\' to be an error', () => {
  expect(sub(1, 'a')).toBe('error')
})

test('[sub] expect the result of v + [a] to be an error', () => {
  expect(sub('v', [1])).toBe('error')
})

test('[rotate] expect the result of [1, 2, 3, 4] to be [2, 3, 4, 1]', () => {
  expect(rotate([1, 2, 3, 4], 1)).toEqual([2, 3, 4, 1])
})

test('[rotate] expect the result of [a, 2, 3, 4] to be an error', () => {
  expect(rotate(['a', 2, 3, 4], 1)).toBe('error')
})

test('[rotate] expect the result of [1, 2, 3, 4, 5] to be [2, 3, 4, 5, 1]', () => {
  expect(rotate([1, 2, 3, 4, 5], 1)).toEqual([2, 3, 4, 5, 1])
})

test('[rotate] expect the result of [1] to be [1]', () => {
  expect(rotate([1], 1)).toEqual([1])
})

test('[rotate] expect the result of [] to be []', () => {
  expect(rotate([], 1)).toEqual([])
})

test('[rotate] expect the result of [[1], 2, 3, 4, 5, 6, 7, 8, 9, 10] to be an error', () => {
  expect(rotate([[1], 2, 3, 4, 5, 6, 7, 8, 9, 10], 1)).toBe('error')
})