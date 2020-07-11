'use strict'

const path = require('path')
const crypto = require('crypto')
const execa = require('execa')
const debug = require('debug')('semantic-release:docker:image')

class Image {
  constructor(opts) {
    this.sha = opts.sha || null
    this.opts = {
      registry: opts.registry
    , project: opts.project
    , name: opts.name
    , build_id: opts.build_id || crypto.randomBytes(10).toString('hex')
    , args: new Map()
    , dockerfile: opts.dockerfile || 'Dockerfile'
    , cwd: opts.cwd || process.cwd()
    }
  }

  get id() {
    if (this.sha) return this.sha
    return `${this.opts.name}:${this.opts.build_id}`
  }

  get repo() {
    const parts = []
    if (this.opts.registry) parts.push(this.opts.registry)
    if (this.opts.project) parts.push(this.opts.project)
    parts.push(this.opts.name)
    return parts.join('/')
  }

  get name() {
    return `${this.repo}:${this.opts.build_id}`
  }

  arg(key, val) {
    this.opts.args.set(key, val)
    return this
  }

  async inspect() {
    const out = await exec('docker', ['inspect', this.name])
  }

  async build(context = '.') {
    const args = []
    for (const [name, value] of this.opts.args.entries()) {
      if (value === true) {
        args.push('--build-arg', name)
      } else {
        args.push('--build-arg', `${name}=${value}`)
      }
    }
    const cmd = [
      'build'
    , '--quiet'
    , '--tag'
    , `${this.name}`
    , ...args
    , '-f'
    , path.join(this.opts.cwd, this.opts.dockerfile)
    , context
    ]
    console.log(cmd, this.opts.args)
    const out = await execa('docker', cmd)
    const {stdout} = out
    const [algo, sha] = stdout.split(':')
    this.sha = sha.substring(0, 12)
    return stdout
  }

  async tag(tag) {
      await execa('docker', ['tag', this.name, `${this.repo}:${tag}`])
      await execa('docker', ['push', `${this.repo}:${tag}`])
  }

  async push() {
    const out = await execa('docker', ['push', this.repo])
    console.log(out)
  }

  async rm() {
  }
}

module.exports = Image
