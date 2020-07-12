'use strict'

const crypto = require('crypto')
const dockerPrepare = require('./lib/prepare.js')
const dockerVerify = require('./lib/verify.js')
const dockerPublish = require('./lib/publish.js')
const readPkg = require('./lib/read-pkg.js')
const parsePkgName = require('./lib/parse-pkg-name.js')

module.exports = {
  prepare
, publish
, verifyConditions
, buildConfig
}

const build_id = crypto.randomBytes(10).toString('hex')

async function prepare(config, context) {
  return dockerPrepare(await buildConfig(config, context), config, context)
}

async function publish(config, context) {
  return dockerPublish(await buildConfig(config, context), config, context)
}

async function verifyConditions(config, context) {
  return dockerVerify(await buildConfig(config, context), config, context)
}

async function buildConfig(config, context) {
  const {
    dockerfile = 'Dockerfile'
  , nocache = false
  , tags = ['latest', '{major}-latest', '{version}']
  , args = {}
  , registry
  , project
  , imageName
  } = config

  const pkg = await readPkg({cwd: context.cwd})
  const parsed = parsePkgName(pkg.name)
  const scope = project || parsed.scope
  const name = imageName || parsed.name

  return {
    tags
  , registry
  , name
  , args
  , dockerfile
  , nocache
  , context
  , build: build_id
  , project: scope
  , context: config.context || '.'
  }
}
