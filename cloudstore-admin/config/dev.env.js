'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
<<<<<<< HEAD
   BASE_API: '"http://120.24.156.254:18888/platform/"'
=======
  BASE_API: '"http://120.24.156.254:18888/platform/"'
>>>>>>> branch 'master' of https://github.com/pzzy2000/cloudstore_web.git
})
