'use strict'

const semver = require('semver')
const docker = require('./docker/index.js')
const string = require('./lang/string/index.js')
const object = require('./lang/object/index.js')
const debug = require('debug')('semantic-release:docker:publish')

module.exports = publish

async function publish(opts, config, context) {
  const {commits, lastRelease, nextRelease, cwd} = context
  const semverNext = semver.parse(nextRelease.version)

  const image = new docker.Image({
    registry: opts.registry
  , project: opts.project
  , name: opts.name
  , dockerfile: opts.dockerfile
  , build_id: opts.build
  , cwd: cwd
  })

  if(opts.args) {
    for (const [key, value] of Object.entries(opts.args)) {
      image.arg(key, value)
    }
  }

  const vars = {
    major: semverNext.major
  , minor: semverNext.minor
  , patch: semverNext.patch
  , version: semverNext.version
  , previous: semverPrevious
  , next: semverNext
  }


  const templates = opts.tags.map((template) => {
    return string.template(template)(vars)
  })

  debug('tagging docker image', image.id)
  for (const tag of tags) {
    context.logger.info(`pushing image: ${image.repo} tag: ${tag}`)
    await image.tag(tag)
  }
}
