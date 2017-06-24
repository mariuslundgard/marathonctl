'use strict'

const encodeAuth = require('./encodeAuth')
const fs = require('fs')
const getAuthFilePath = require('./getAuthFilePath')
const prompt = require('prompt-sync')()

module.exports = function getAuth (marathonUrl, env) {
  const authFilePath = getAuthFilePath(marathonUrl, env)
  const authFileExists = fs.existsSync(authFilePath)

  if (!authFileExists) {
    const user = prompt('Enter username: ', null)
    const pass = prompt('Enter password: ', null, {echo: '*'})
    return (user && pass) ? encodeAuth(user, pass) : null
  }

  return fs.readFileSync(authFilePath).toString().trim()
}
