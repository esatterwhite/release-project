'use strict'

const path = require('path')
const docker = require('./docker/index.js')
const debug = require('debug')('semantic-release:docker:prepare')

module.exports = dockerPrepare

async function dockerPrepare(opts, config, context) {
  const {cwd} = context
  const image = new docker.Image({
    registry: opts.registry
  , project: opts.project
  , name: opts.name
  , dockerfile: opts.dockerfile
  , build_id: opts.build
  , cwd: cwd
  })
  context.logger.info('building image', image.name)

  await image.build(path.join(cwd, opts.context))
}
