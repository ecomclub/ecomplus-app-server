'use strict'
const callback = require('express').Router()
const logger = require('console-files')
/**
 * @description handle ecomplus callbacks
 */
module.exports = ({ ecomAuth, appConfig }) => {
  return callback.post('', (request, response) => {
    ecomAuth.then(sdk => {
      let storeId = parseInt(request.headers['x-store-id'], 10)
      sdk.handleCallback(storeId, request.body).then(async ({ isNew, authenticationId }) => {
        if (isNew) {
          require('./../webhook')(appConfig)(request.body)
        }
        response.status(204)
        return response.end()
      })
        .catch(err => {
          if (typeof err.code === 'string' && !err.code.startsWith('SQLITE_CONSTRAINT')) {
            // debug SQLite errors
            logger.error(err)
          }
          response.status(500)
          return response.send({ erro: 'bling_callback_erro', message: err.message })
        })
    })
      .catch(e => {
        logger.error('Erro with ecomplus-app-sdk' + e)
        response.status(400)
        return response.end()
      })
  })
}
