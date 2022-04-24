import test from 'ava'
import { replace } from '../src/replace.js'

// #region
test('replace(): parses strings', t => {
  const data = { value: 'value' }
  const resolved = replace(data, '{{ value }}')

  t.is(resolved, 'value')
})

test('replace(): parses numbers', t => {
  const data = { value: 2 }
  const resolved = replace(data, '{{ value }}')

  t.is(resolved, '2')
})

test('replace(): parses bigints', t => {
  const data = { value: BigInt(Number.MAX_SAFE_INTEGER) + BigInt(10) }
  const resolved = replace(data, '{{ value }}')

  t.is(resolved, '9007199254741001')
})

test('replace(): throws for arrays', t => {
  const data = { value: [] }
  t.throws(() => replace(data, '{{ value }}'))
})

test('replace(): throws for objects', t => {
  const data = { value: {} }
  t.throws(() => replace(data, '{{ value }}'))
})
// #endregion

// #region
// #region
test('replace(): does not exist, is not lazy, no value -> throws', t => {
  t.throws(() => replace({}, '{{ a.b }}'))
})

test('replace(): does exist, is not lazy, no value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ a.b }}')

  t.is(resolved, '2')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, no value -> empty string', t => {
  const resolved = replace({}, '{{ ?a.b }}')
  t.is(resolved, '')
})

test('replace(): does exist, is lazy, no value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ ?a.b }}')

  t.is(resolved, '2')
})
// #endregion

// #region
test('replace(): does not exist, is not lazy, has value -> throws', t => {
  t.throws(() => replace({}, '{{ a.b:"value" }}'))
})

test('replace(): does exist, is not lazy, has value -> resolves to additional value', t => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ a.b:"value" }}')

  t.is(resolved, 'value')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, has value -> resolves to additional value', t => {
  const resolved = replace({}, '{{ ?a.b:"value" }}')
  t.is(resolved, 'value')
})

test('replace(): does exist, is lazy, has value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace(data, '{{ ?a.b:"value" }}')

  t.is(resolved, '2')
})
// #endregion
// #endregion
