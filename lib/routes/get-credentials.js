'use strict'
const credentials = require('express').Router()
/**
 * 
 */
module.exports = ({ ecomAuth }) => {
  return credentials.post('', (request, response) => {
    ecomAuth.then(sdk => {
      let storeId = parseInt(request.headers['x-store-id'], 10) || request.query.store_id
      if (storeId) {
        sdk.getAuth(storeId)
          .then(async auth => {
            return response.status(200).send({
              access_token: auth.row.access_token,
              my_id: auth.row.authentication_id
            })
          })
          .catch(e => {
            return response.status(400).send('' + e)
          })
      } else {
        return response.status(400).send({ error: 'X-Store-id not found at request header or query.string' })
      }
    })
  })
}
