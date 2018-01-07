const feathers = require('@feathersjs/feathers')
const rest = require('@feathersjs/rest-client')
const reactive = require('feathers-reactive')
const fetch = require('isomorphic-unfetch')

export default feathers()
  .configure(rest().fetch(fetch))
  .configure(reactive({idField: '_id'}))
