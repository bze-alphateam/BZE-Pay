/**
* ==============================================================================
* BTCz-Pay
* ==============================================================================
*
* Version 0.2.0 (production v1.0)
*
* Self-hosted bitcoinZ payment gateway
* https://github.com/MarcelusCH/BTCz-Pay
*
* ------------------------------------------------------------------------------
* deploy-design-docs.js                                  Required by btcz-pay.js
* ------------------------------------------------------------------------------
*
* checks if design docs are deployed
* to Couchdb and deloys them if not
*
* ==============================================================================
*/

let fs = require('fs')
let storage = require('./models/storage')

fs.readdir('./_design_docs', function (err, designDocs) {
  if (err) {
    console.log('Cant read design documents list')
    process.exit()
  }

  let readFileCallback = function (err, data) {
    let json = JSON.parse(data)
    if (err) {
      return console.log(err)
    }
    storage.getDocumentPromise(json._id).then(function (doc) {
      if (!doc || doc.error === 'not_found') {
        console.log(json._id + ' design doc needs to be created')
        storage.saveDocumentPromise(json).then(function (response, err) {
          console.log('Creating design document resulted in:', JSON.stringify(response || err))
        })
      }
    })
  }

  for (let i = 0; i < designDocs.length; i++) {
    fs.readFile('./_design_docs' + '/' + designDocs[i], 'utf8', readFileCallback)
  }
})
