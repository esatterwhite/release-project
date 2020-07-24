'use strict'

const {test, threw} = require('tap')
const parsePkgName = require('../../lib/parse-pkg-name.js')

test('parsePkgName', async (t) => {
  t.deepEqual(parsePkgName('test'), {
    scope: null
  , name: 'test'
  }, 'non-scoped package name')

  t.deepEqual(parsePkgName('@namespace/foobar'), {
    scope: 'namespace'
  , name: 'foobar'
  }, 'scoped package name')

  t.throws(() => {
    parsePkgName('nampace/foobar')
  }, /invalid package name/gi)
}).catch(threw)
