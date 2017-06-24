'use strict'

module.exports = function getAuthFilePath (marathonUrl, env) {
  if (!env) {
    throw new Error('missing env object')
  }

  return `${env.HOME}/.marathon/${marathonUrl.replace('://', '___')}`
}
