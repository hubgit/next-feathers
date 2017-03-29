const next = require('next')
const levelup = require('levelup')
const feathers = require('feathers')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')
const levelupService = require('feathers-levelup')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = feathers()
    .configure(rest())
    .use(bodyParser.json())

  server.use('/api/articles', levelupService({
    db: levelup('./db', {valueEncoding: 'json'}),
    paginate: {default: 5, max: 50}
  }))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
