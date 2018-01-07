const next = require('next')
const server = require('./feathers-server')

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(server(handle))
