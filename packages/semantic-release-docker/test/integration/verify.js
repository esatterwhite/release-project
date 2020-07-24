'use strict'

const crypto = require('crypto')
const sinon = require('sinon')
const {test, threw} = require('tap')

const buildConfig = require('../../lib/build-config.js')
const verify = require('../../lib/verify.js')
const DOCKER_REGISTRY_HOST = process.env.TEST_DOCKER_REGISTRY || 'localhost:5000'

test('steps::verify', async (t) => {
  const build_id = crypto.randomBytes(5).toString('hex')
  t.test('docker password, no username', async (tt) => {
    const context = {
      env: {
        ...process.env
      , DOCKER_REGISTRY_PASSWORD: 'abc123'
      }
    , cwd: process.cwd()
    , logger: {
        success: sinon.stub()
      , info: sinon.stub()
      }
    }
    const config = await buildConfig(build_id, {}, context)
    await tt.rejects(
      verify(config, context)
    , {
        message: /docker authentication failed/i
      , code: 'EAUTH'
      , details: /DOCKER_REGISTRY_USER AND DOCKER_REGISTRY_PASSWORD must be set/ig
      }
    )
  })

  t.test('docker password, no username', async (tt) => {
    const context = {
      env: {
        ...process.env
      , DOCKER_REGISTRY_USER: 'abc123'
      }
    , cwd: process.cwd()
    , logger: {
        success: sinon.stub()
      , info: sinon.stub()
      }
    }
    const config = await buildConfig(build_id, {}, context)
    await tt.rejects(
      verify(config, context)
    , {
        message: /docker authentication failed/i
      , code: 'EAUTH'
      , details: /DOCKER_REGISTRY_USER AND DOCKER_REGISTRY_PASSWORD must be set/ig
      }
    )
  })

  t.test('docker USER/PASS succeeds', async (tt) => {
    const context = {
      env: {
        ...process.env
      , DOCKER_REGISTRY_USER: 'iamweasel'
      , DOCKER_REGISTRY_PASSWORD: 'secretsquirrel'
      }
    , cwd: process.cwd()
    , logger: {
        success: sinon.stub()
      , info: sinon.stub()
      }
    }
    const config = await buildConfig(build_id, {
      registry: DOCKER_REGISTRY_HOST
    }, context)
    tt.resolves(verify(config, context))
  })

  t.test('docker USER / GITHUB_TOKEN succeeds', async (tt) => {
    const context = {
      env: {
        ...process.env
      , DOCKER_REGISTRY_USER: 'iamweasel'
      , GITHUB_TOKEN: 'secretsquirrel'
      }
    , cwd: process.cwd()
    , logger: {
        success: sinon.stub()
      , info: sinon.stub()
      }
    }
    const config = await buildConfig(build_id, {
      registry: DOCKER_REGISTRY_HOST
    }, context)
    tt.resolves(verify(config, context))
  })

  t.test('No auth provided succeed', async (tt) => {
    const context = {
      env: {
        ...process.env
      }
    , cwd: process.cwd()
    , logger: {
        success: sinon.stub()
      , info: sinon.stub()
      }
    }

    const config = await buildConfig(build_id, {
      registry: DOCKER_REGISTRY_HOST
    }, context)
    tt.strictEqual(await verify(config, context), false, 'auth step skipped')
  })
}).catch(threw)
