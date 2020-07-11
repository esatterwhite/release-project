'use strict'

const {inspect} = require('util')
const debug = require('debug')('semantic-release:docker:verify')

module.exports = verify

async function verify(config, context) {
  console.log(inspect(context, {depth: 100}))
  const {env, logger} = context
  const PASSWORD = env.DOCKER_REGISTRY_PASSWORD || env.GITHUB_TOKEN
  const USERNAME = env.DOCKER_REGISTRY_USER

  if (!USERNAME && !PASSWORD) {
    logger.info('No docker credentials found.  Skipping login')
    return true
  }

  if (!(env.DOCKER_REGISTRY_USER && env.DOCKER_REGISTRY_PASSWORD)) {
    const error = new Error(
      'Both ENV vars DOCKER_REGISTRY_USER and DOCKER_REGISTRY_PASSWORD must be set'
    )
    error.code = 'EAUTH'
    throw error
  }

  const {stdout} = await execa('docker', [
    'login'
  , config.registry || ''
  , '-u', USERNAME
  , '-p', PASSWORD
  ])

  console.log(stdout)
  logger.success('docker login successful')
  return true
}
