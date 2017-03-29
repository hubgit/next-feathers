const next = require('next')
const path = require('path')
const glob = require('glob')
const feathers = require('feathers')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = feathers()
    .configure(rest())
    .use(bodyParser.json())

  glob.sync('./services/*.js').forEach(file => {
    const { name } = path.parse(file)

    server.use(name, require(file)({
      paginate: { default: 10, max: 25 }
    }))
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
