import test from 'ava'
import { replace } from '../src/replace.js'

// #region
test('replace(): does not exist, is not lazy, no value -> throws', t => {
  t.throws(() => replace('{{ a.b }}', {}))
})

test('replace(): does exist, is not lazy, no value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace('{{ a.b }}', data)

  t.is(resolved, '2')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, no value -> empty string', t => {
  const resolved = replace('{{ ?a.b }}', {})
  t.is(resolved, '')
})

test('replace(): does exist, is lazy, no value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace('{{ ?a.b }}', data)

  t.is(resolved, '2')
})
// #endregion

// #region
test('replace(): does not exist, is not lazy, has value -> throws', t => {
  t.throws(() => replace('{{ a.b:"value" }}', {}))
})

test('replace(): does exist, is not lazy, has value -> resolves to additional value', t => {
  const data = { a: { b: 2 } }
  const resolved = replace('{{ a.b:"value" }}', data)

  t.is(resolved, 'value')
})
// #endregion

// #region
test('replace(): does not exist, is lazy, has value -> resolves to additional value', t => {
  const resolved = replace('{{ ?a.b:"value" }}', {})
  t.is(resolved, 'value')
})

test('replace(): does exist, is lazy, has value -> resolves to value of path', t => {
  const data = { a: { b: 2 } }
  const resolved = replace('{{ ?a.b:"value" }}', data)

  t.is(resolved, '2')
})
// #endregion
