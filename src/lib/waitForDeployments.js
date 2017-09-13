'use strict'

const Promise = require('bluebird')

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const waitForDeployments = (apiClient, deploymentIds, timeoutMs = -1) => {
  const startTime = Date.now()
  const initialDelayMs = 1000
  const delayMs = 500

  const check = () => {
    return delay(initialDelayMs).then(() => {
      return apiClient.getDeployments().then(data => {
        const ids = data.map(d => d.id)
        const found = []

        ids.forEach(deploymentId => {
          if (deploymentIds.indexOf(deploymentId) > -1) {
            found.push(deploymentId)
          }
        })

        if (found.length > 0) {
          return delay(delayMs).then(() => {
            const duration = Date.now() - startTime

            if (timeoutMs > -1 && duration > timeoutMs) {
              return Promise.reject(new Error('Timed out'))
            }

            return check()
          })
        }

        return true
      })
    })
  }

  return check()
}

module.exports = waitForDeployments
