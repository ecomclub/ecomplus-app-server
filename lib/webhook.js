'use strict'
const rq = require('request')

module.exports = (appConfig) => {
  return (body) => {
    if (appConfig.webhook) {
      let options = {
        uri: appConfig.webhook,
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      return rq(options)
    }
  }
}