#!/usr/bin/env node
'use strict'
const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const sqlite = require('sqlite3').verbose()
//
const { ecomAuth, setup } = require('ecomplus-app-sdk')
let appConfig = {}

if (process.argv[2] === '--config') {
  appConfig = fs.readFileSync(process.argv[3], 'utf8')
  appConfig = JSON.parse(appConfig)
} else {
  console.log('\nflag --config not found \ntry: ecomplus-app-server --config /path/to/app-config.json')
  process.exit(1)
}

setup(appConfig.ecom_auth_db)

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

const port = appConfig.port || 5000

// config db
const db = new sqlite.Database(appConfig.ecom_auth_db)

// middleware
const middleware = require('./lib/token')(appConfig)

app.use(bodyParser.json())
app.use(require('./lib/routes')({ ecomAuth, db, appConfig, middleware }))
app.listen(port)
console.log('Rodando em', port)
