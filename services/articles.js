const levelup = require('levelup')
const levelupService = require('feathers-levelup')

module.exports = levelupService({
  db: levelup('./db', {valueEncoding: 'json'}),
  paginate: {default: 5, max: 50}
})
