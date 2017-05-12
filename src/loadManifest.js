'use strict'

const Ajv = require('ajv')
const fs = require('fs')
const schemas = require('./schemas')

const validateManifestPath = (manifestPath) => {
  if (!fs.existsSync(manifestPath)) {
    return false
  }

  return true
}

const validateManifest = (manifest) => {
  const ajv = new Ajv()
  const validate = ajv.compile(schemas.manifest)

  if (!validate(manifest)) {
    validate.errors.forEach((err) => {
      console.log(`  Manifest error: manifest${err.dataPath} ${err.message}`)
    })

    return false
  }

  return true
}

module.exports = function loadManifest (manifestPath) {
  return new Promise((resolve, reject) => {
    if (!validateManifestPath(manifestPath)) {
      return reject(new Error(`the manifest path is invalid: ${manifestPath}`))
    }

    let manifest
    const manifestBuf = fs.readFileSync(manifestPath)

    try {
      manifest = JSON.parse(manifestBuf.toString())
    } catch (_) {
      return reject(new Error(`the manifest is not valid json: ${manifestPath}`))
    }

    if (!validateManifest(manifest)) {
      return reject(new Error(`the manifest is invalid: ${manifestPath}`))
    }

    return resolve(manifest)
  })
}
