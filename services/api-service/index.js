'use strict'
const http = require('http')
const PORT = process.env.PORT || 3001
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  res.write(JSON.stringify({message: 'ok'}))
  res.end()
})

async function onSignal(signal) {
  console.log(`system signal received ${signal}`)
  try {
    console.log('closing server')
    server.close()
  } catch (err) {
    /* istanbul ignore next */
    console.error(err, {err})
  }
}


if (require.main === module) {
  server.listen(PORT)
}



