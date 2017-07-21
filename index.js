import fetch from 'node-fetch'
import semver from 'semver'
import fs from 'fs-extra'

import { readPackageJsonFromArchive } from './utilities'

async function getPinnedReference({name, reference}) {
  // only require extra process if input reference is not pinned
  if (semver.validRange(reference) && !semver.valid(reference)) {
    let response = await fetch(`https://registry.yarnpkg.com/${name}`)
    let info = await response.json()

    let versions = Object.keys(info.versions)
    let maxSatisfying = semver.maxSatisfying(versions, reference)

    if (maxSatisfying == null) {
      throw new Error(`Couldn't find a version matching "${reference}" for package "${name}"`)
    }

    reference = maxSatisfying
  }

  return {name, reference}
}

async function fetchPackage({name, reference}) {

  if([`/`, `./`, `../`].some((prefix) => reference.startsWith(prefix)))
    return await fs.readFile(reference)

  if(semver.valid(reference))
    return await fetchPackage({name, reference: `https://registry.yarnpkg.com/${name}/-/${name}-${reference}.tgz`})

  let response = await fetch(reference)
  if(!response.ok)
    throw new Error(`Couldn't fetch package "${reference}"`)
  return await response.buffer()
}

async function getPackageDependencies({ name, reference }) {
  let packageBuffer = await fetchPackage({ name, reference })
  let packageJson = JSON.parse(await readPackageJsonFromArchive(packageBuffer))

  let dependencies = packageJson.dependencies || {}

  return Object.keys(dependencies).map(name => {
    return { name, reference: dependencies[name] }
  })
}

export { getPinnedReference, getPackageDependencies }
