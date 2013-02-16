const ssbl = require('./')
    , path = require('path')

ssbl(path.join(__dirname, 'example'), function (err, data) {
  if (err) throw err

  console.log('This is the data structure generated from the ./example/ directory:')
  console.log('-------------------------------------------------------------------')
  console.log(JSON.stringify(data, null, 2))
  console.log('-------------------------------------------------------------------')
})