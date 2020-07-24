'use strict'

const execa = require('execa')
const SemanticError = require('@semantic-release/error')
module.exports = verify

async function verify(opts, context) {
  const {env, logger} = context
  const PASSWORD = env.DOCKER_REGISTRY_PASSWORD || env.GITHUB_TOKEN
  const USERNAME = env.DOCKER_REGISTRY_USER

  if (!USERNAME && !PASSWORD) {
    logger.info('No docker credentials found.  Skipping login')
    return false
  }

  let set = 0
  if (USERNAME) set += 1
  if (PASSWORD) set += 1

  if (set !== 2) {
    const error = new SemanticError(
      'Docker authentication failed'
    , 'EAUTH'
    , 'Both ENV vars DOCKER_REGISTRY_USER and DOCKER_REGISTRY_PASSWORD must be set'
    )
    throw error
  }

  const passwd = execa('echo', [PASSWORD])
  const login = execa('docker', [
    'login'
  , opts.registry || ''
  , '-u', USERNAME
  , '--password-stdin'
  ])

  passwd.stdout.pipe(login.stdin)
  await login
  logger.success('docker login successful')
  return true
}
