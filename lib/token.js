'use strict'

module.exports = (appConfig) => {
  return (request, response, next) => {
    if (!appConfig.token) {
      next()
    } else {
      let token = request.headers['x-token'] || request.query.token

      if (!token) {
        response.status(403)
        return response.send({ error: 'token not found' })
      }

      if (token !== appConfig.token) {
        response.status(403)
        return response.send({ error: 'token not match' })
      }

      next()
    }
  }
}
