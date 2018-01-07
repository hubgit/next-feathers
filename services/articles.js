const NeDB = require('nedb')
const service = require('feathers-nedb')

const Model = new NeDB({
  filename: './data/articles.db',
  autoload: true
})

module.exports = options => service({ Model, ...options })
