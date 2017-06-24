'use strict'

module.exports = function (user, pass) {
  return Buffer.from(`${user}:${pass}`).toString('base64')
}
