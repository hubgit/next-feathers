import feathers from 'feathers/client'
import hooks from 'feathers-hooks'
import rest from 'feathers-rest/client'
import reactive from 'feathers-reactive'
import rxjs from 'rxjs'
import 'isomorphic-fetch'

export default feathers()
  .configure(hooks())
  .configure(rest().fetch(fetch))
  .configure(reactive(rxjs))
