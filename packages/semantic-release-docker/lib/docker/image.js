'use strict'

const path = require('path')
const crypto = require('crypto')
const execa = require('execa')

class Image {
  constructor(opts) {
    const {
      registry = null
    , project = null
    , name = null
    , sha = null
    , build_id = crypto.randomBytes(10).toString('hex')
    , dockerfile = 'Dockerfile'
    , cwd = process.cwd()
    , context = '.'
    } = opts || {}

    if (!name || typeof name !== 'string') {
      const error = new TypeError('Docker Image "name" is required and must be a string')
      throw error
    }

    this.sha = sha
    this.opts = {
      args: new Map()
    , registry: registry
    , project: project
    , name: name
    , build_id: build_id
    , dockerfile: dockerfile
    , context: context
    , cwd: cwd
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

  get context() {
    return this.opts.context
  }

  set context(ctx) {
    this.opts.context = ctx
    return this.opts.context
  }

  arg(key, val) {
    this.opts.args.set(key, val)
    return this
  }

  get build_cmd() {
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
    , this.context
    ]
    return cmd
  }

  async build() {
    const out = await execa('docker', this.build_cmd)
    const {stdout} = out
    const [_, sha] = stdout.split(':')
    this.sha = sha.substring(0, 12)
    return this.sha
  }

  async tag(tag, push = true) {
    await execa('docker', ['tag', this.name, `${this.repo}:${tag}`])
    if (!push) return

    await execa('docker', ['push', `${this.repo}:${tag}`])
  }

  async push() {
    await execa('docker', ['push', this.repo])
  }

  async clean() {
    const images = execa('docker', ['images', this.repo, '-q'])
    const rm = execa('xargs', ['docker', 'rmi', '-f'])
    images.stdout.pipe(rm.stdin)
    return rm
  }
}

module.exports = Image
