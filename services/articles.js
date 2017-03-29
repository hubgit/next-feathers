const fs = require('fs')
const glob = require('glob')
const path = require('path')
const uuid = require('uuid')
const mkdirp = require('mkdirp')
const jsonfile = require('jsonfile')

const dataDir = () => {
  const dir = path.join(__dirname, '..', 'data', 'articles')

  mkdirp.sync(dir)

  return dir
}

const articleDir = (id, create) => {
  if (id.indexOf('/') !== -1) throw new Error('No slashes in the id!')

  const dir = path.join(dataDir(), id)

  if (create) {
    mkdirp.sync(dir)
  } else {
    if (!fs.existsSync(dir)) {
      throw new Error('Article dir not found')
    }
  }

  console.log(dir)

  return dir
}

const dataPath = id => {
  return path.join(articleDir(id, true), 'article.json')
}

module.exports = options => {
  return {
    find (params) {
      return new Promise((resolve) => {
        const paths = glob.sync(path.join(dataDir(), '*'))
        const total = paths.length

        const skip = Math.min(total, params.query.skip)

        const limit = params.query.limit
          ? Math.min(options.paginate.max, params.query.limit)
          : options.paginate.default

        const data = paths.slice(skip, limit).map(jsonPath => {
          return jsonfile.readFileSync(path.join(jsonPath, 'article.json'))
        })

        resolve({total, data})
      })
    },

    get(id) {
      return new Promise((resolve, reject) => {
        const jsonPath = dataPath(id)

        jsonfile.readFile(jsonPath, (err, data) => {
          if (err) reject(err)
          resolve(data)
        })
      })
    },

    create(data) {
      return new Promise((resolve, reject) => {
        const id = uuid()

        data.id = id

        const jsonPath = dataPath(id)

        jsonfile.writeFile(jsonPath, data, err => {
          if (err) reject(err)
          resolve(data)
        })
      })
    },

    update(id, data) {
      return new Promise((resolve, reject) => {
        const jsonPath = dataPath(id)

        jsonfile.writeFile(jsonPath, data, err => {
          if (err) reject(err)
          resolve(data)
        })
      })
    },

    patch(id, newData) {
      return new Promise((resolve, reject) => {
        const jsonPath = dataPath(id)

        jsonfile.readFile(jsonPath, (data, err) => {
          if (err) reject(err)

          Object.assign(data, newData)

          jsonfile.writeFile(jsonPath, data, err => {
            if (err) reject(err)
            resolve(newData)
          })
        })
      })
    },

    remove(id) {
      return new Promise((resolve, reject) => {
        const jsonPath = dataPath(id)

        jsonfile.readFile(jsonPath, (data, err) => {
          if (err) reject(err)

          fs.unlink(dataPath(id), err => {
            if (err) reject(err)

            fs.rmdir(articleDir(id), err => {
              if (err) reject(err)

              resolve(data)
            })
          })
        })
      })
    }
  }
}
