'use strict'
const stores = require('express').Router()
/**
 * 
 */
module.exports = ({ ecomAuth, db }) => {
  return stores.post('', (request, response) => {
    ecomAuth.then(sdk => {
      let query = 'SELECT store_id FROM ecomplus_app_auth'
      db.all(query, (erro, rows) => {
        if (erro) {
          return response.status(400).send(erro)
        }
        return response.status(200).send((rows || 0))
      })
    })
  })
}
