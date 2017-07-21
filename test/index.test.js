import { getPinnedReference, getPackageDependencies } from '../index'
var chai = require('chai')
var assert = chai.assert

describe('Array', function() {
  it('should return -1 when the value is not present', function() {
    assert.equal(-1, [1, 2, 3].indexOf(4))
  })
})

describe('getPinnedReference', function() {
  it('should respond with correct versions with ~ range', async function() {
    const result = await getPinnedReference({name: "react", reference: "~15.3.0"})
    assert.equal(result.name, 'react')
    assert.equal(result.reference, '15.3.2')
  })
  it('should respond with correct versions with pinned range', async function() {
    const result = await getPinnedReference({name: "react", reference: "15.3.0"})
    assert.equal(result.name, 'react')
    assert.equal(result.reference, '15.3.0')
  })
  it('should respond with correct versions with local path', async function() {
    const result = await getPinnedReference({name: "react", reference: "/tmp/react-15.3.2.tar.gz"})
    assert.equal(result.name, 'react')
    assert.equal(result.reference, '/tmp/react-15.3.2.tar.gz')
  })
})

describe('getPackageDependencies', function() {
  it('should get the first layer of dependencies', async function() {
    const result = await getPackageDependencies({name: "react", reference: "15.6.1"})
    assert.equal(result.some(d => d.name == "create-react-class" && d.reference == '^15.6.0'), true)
    assert.equal(result.some(d => d.name == "prop-types" && d.reference == '^15.5.10'), true)
  })
})
