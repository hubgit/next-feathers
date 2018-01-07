const path = require('path')
const glob = require('glob')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')

module.exports = handle => {
  const app = express(feathers())
  app.use(express.json())
  app.configure(express.rest())

  glob.sync('./services/*.js').forEach(file => {
    const { name } = path.parse(file)

    app.use(name, require(file)({
      paginate: { default: 10, max: 25 }
    }))
  })

  app.get('*', (req, res) => {
    handle(req, res)
  })

  app.use(express.errorHandler())

  app.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
}
