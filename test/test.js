import { getPinnedReference } from '../index'
var assert = require('assert')

describe('Array', function() {
  it('should return -1 when the value is not present', function() {
    assert.equal(-1, [1, 2, 3].indexOf(4))
  })
})

describe('getPinnedReference', function() {
  it('should respond with correct versions within specified range', async function() {
    const result = await getPinnedReference({name: "react", reference: "~15.3.0"})
    assert.equal(result.name, 'react')
    assert.equal(result.reference, '15.3.2')
  })
})
