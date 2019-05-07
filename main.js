#!/usr/bin/env node
'use strict'
const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const sqlite = require('sqlite3').verbose()
//
const { ecomAuth } = require('ecomplus-app-sdk')
const db = new sqlite.Database(process.env.ECOM_AUTH_DB)
let appConfig = {}

if (process.argv[2]) {
  appConfig = fs.readFileSync(process.argv[2], 'utf8')
  appConfig = JSON.parse(appConfig)
}

ecomAuth.then(appSdk => {
  // configure setup for stores
  // list of procedures to save
  appSdk.configureSetup((appConfig.procedures || null), (err, { storeId }) => {
    if (!err) {
      console.log('Setup store #' + storeId)
    } else if (!err.appAuthRemoved) {
      console.error(err.response.data)
    }
  })
})

ecomAuth.catch(err => {
  console.error(err)
  setTimeout(() => {
    // destroy Node process while Store API auth cannot be handled
    process.exit(1)
  }, 1000)
})

const port = appConfig.port || 3000

// middleware
const middleware = require('./lib/token')(appConfig)

app.use(bodyParser.json())
app.use(require('./lib/routes')({ ecomAuth, db, appConfig, middleware }))
app.listen(port)
console.log('Rodando em', port)
