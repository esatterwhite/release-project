'use strict'

const now = new Date()
const year = now.getFullYear()
const day = lpad(now.getDate())
const month = lpad(now.getMonth() + 1)

function lpad(num, digits = 2) {
  let res = String(num)
  while (res.length < digits) {
    res = `0${res}`
  }
  return res
}

module.exports = {
  parserOpts: {
    noteKeywords: ['BREAKING', 'BREAKING CHANGE', 'BREAKING CHANGES']
  , referenceActions: [
      'close', 'closes', 'closed'
    , 'fix', 'fixes', 'fixed'
    , 'resolve', 'resolves', 'resolved'
    ]
  }
, releaseRules: [
    {type: 'build', release: 'patch'}
  , {type: 'ci', release: 'patch'}
  , {type: 'release', release: 'patch'}
  , {type: 'chore', release: 'patch'}
  , {type: 'refactor', release: 'patch'}
  , {type: 'test', release: 'patch'}
  , {type: 'doc', release: 'patch'}
  , {type: 'lib', release: 'patch'}
  ]
, plugins: [
    '@semantic-release/commit-analyzer'
  , '@semantic-release/release-notes-generator'
  , '@semantic-release/changelog'
  , ['@codedependant/semantic-release-docker', {
      registry: 'docker.pkg.github.com/esatterwhite'
    , image: 'release-project/api-service'
    , tags: ['{major}-latest', '{major}.{minor}-latest', 'latest', '{version}']
    , args: {
        GITHUB_PACKAGES_TOKEN: true
      }
    }]

  , ['@semantic-release/npm', {
      npmPublish: false
    }]

  , ['@semantic-release/git', {
      assets: ['packages.json', 'pnpm-lock.yaml', 'CHANGELOG.md']
    , message: 'chore(release): <=% new Date()%> Version <%= nextRelease.version %> (Stable) Release'
    }]
  ]
}
