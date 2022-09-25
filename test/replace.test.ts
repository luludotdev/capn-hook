import { test, expect } from 'vitest'
import { replace } from '../src/replace.js'

// #region
test('replace(): parses strings', () => {
  const data = { value: 'value' }
  const resolved = replace(data, '{{ value }}')

  expect(resolved).toBe('value')
})

test('replace(): parses numbers', () => {
  const data = { value: 2 }
  const resolved = replace(data, '{{ value }}')

  expect(resolved).toBe('2')
})

test('replace(): parses bigints', () => {
  const data = { value: BigInt(Number.MAX_SAFE_INTEGER) + BigInt(10) }
  const resolved = replace(data, '{{ value }}')

  expect(resolved).toBe('9007199254741001')
})

test('replace(): throws for arrays', () => {
  const data = { value: [] }
  expect(() => replace(data, '{{ value }}')).toThrow()
})

test('replace(): throws for objects', () => {
  const data = { value: {} }
  expect(() => replace(data, '{{ value }}')).toThrow()
})
// #endregion

// #region
// #region
test('replace(): does not exist, is not lazy, no value -> throws', () => {
  expect(() => replace({}, '{{ a.b }}')).toThrow()
})

test('replace(): does exist, is not lazy, no value -> resolves to value of path', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ a.b }}')

  expect(resolved).toBe('2')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, no value -> empty string', () => {
  const resolved = replace({}, '{{ ?a.b }}')
  expect(resolved).toBe('')
})

test('replace(): does exist, is lazy, no value -> resolves to value of path', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ ?a.b }}')

  expect(resolved).toBe('2')
})
// #endregion

// #region
test('replace(): does not exist, is not lazy, has value -> throws', () => {
  expect(() => replace({}, '{{ a.b:"value" }}')).toThrow()
})

test('replace(): does exist, is not lazy, has value -> resolves to additional value', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ a.b:"value" }}')

  expect(resolved).toBe('value')
})

test('replace(): does not exist, is not lazy, has lazy value -> empty string', () => {
  const resolved = replace({}, '{{ a.b:"value"? }}')
  expect(resolved).toBe('')
})

test('replace(): does exist, is not lazy, has lazy value -> resolves to additional value', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ a.b:"value"? }}')

  expect(resolved).toBe('value')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, has value -> resolves to additional value', () => {
  const resolved = replace({}, '{{ ?a.b:"value" }}')
  expect(resolved).toBe('value')
})

test('replace(): does exist, is lazy, has value -> resolves to value of path', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ ?a.b:"value" }}')

  expect(resolved).toBe('2')
})

test('replace(): does not exist, is lazy, has lazy value -> resolves to additional value', () => {
  const resolved = replace({}, '{{ ?a.b:"value"? }}')
  expect(resolved).toBe('value')
})

test('replace(): does exist, is lazy, has lazy value -> resolves to value of path', () => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ ?a.b:"value"? }}')

  expect(resolved).toBe('2')
})
// #endregion
// #endregion
