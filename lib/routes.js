'use strict'

const router = require('express').Router()
const pkg = require('../package.json')

module.exports = ({ ecomAuth, db, appConfig, middleware }) => {
  router.use('/callback', require('./routes/callback')({ ecomAuth, appConfig }))
  router.use('/credentials', middleware, require('./routes/get-credentials')({ ecomAuth }))
  router.use('/stores', middleware, require('./routes/list-stores')({ ecomAuth, db }))
  // show package.json on domain root
  router.get('/', (req, res) => res.send(pkg))
  return router
}
