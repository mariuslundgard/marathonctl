'use strict'

module.exports = function (user, pass) {
  return new Buffer(`${user}:${pass}`).toString('base64')
}
