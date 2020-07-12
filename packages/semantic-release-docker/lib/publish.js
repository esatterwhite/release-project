'use strict'

const semver = require('semver')
const docker = require('./docker/index.js')
const string = require('./lang/string/index.js')

module.exports = publish

async function publish(opts, config, context) {
  const {commits, lastRelease, nextRelease, cwd, logger} = context
  const versions = {
    next: semver.parse(nextRelease.version)
  , previous: semver.parse(lastRelease.version)
  }

  const image = new docker.Image({
    registry: opts.registry
  , project: opts.project
  , name: opts.name
  , dockerfile: opts.dockerfile
  , build_id: opts.build
  , cwd: cwd
  })

  if (config.args) {
    for (const [key, value] of Object.entries(config.args)) {
      image.arg(key, value)
    }
  }

  const vars = {
    ...versions.next
  , ...versions
  }

  const tags = opts.tags.map((template) => {
    return string.template(template)(vars)
  })

  logger.info('tagging docker image', image.id)
  for (const tag of tags) {
    context.logger.info(`pushing image: ${image.repo} tag: ${tag}`)
    await image.tag(tag)
  }
}
