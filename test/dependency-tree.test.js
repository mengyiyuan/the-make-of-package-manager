import { resolve } from 'path'
import util from 'util'

import { getDependencyTree } from '../index'

let cwd = process.cwd() + "/test/"
let packageJson = require(resolve(cwd, `sample-package.json`))

packageJson.dependencies = Object.keys(packageJson.dependencies || {}).map(name => {
  return { name, reference: packageJson.dependencies[name] }
})

getDependencyTree(packageJson).then(tree => {
  console.log(util.inspect(tree, { depth: Infinity }))
})
