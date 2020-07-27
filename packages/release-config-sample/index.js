'use strict'

const templates = require('./templates')

const issuesUrl = 'https://logdna.atlassian.net'
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

const COMMIT_TYPES = new Map([
  ['feat', 'Features']
, ['fix', 'Bug Fixes']
, ['perf', 'Performance Improvements']
, ['revert', 'Reverts']
, ['doc', 'Documentation']
, ['style', 'Style']
, ['lint', 'Lint']
, ['refactor', 'Code Refactoring']
, ['test', 'Tests']
, ['build', 'Build System']
, ['ci', 'Continuous Integration']
, ['chore', 'Chores']
, ['default', 'Miscellaneous']
])

function typeOf(type) {
  return COMMIT_TYPES.get(type) || COMMIT_TYPES.get('default')
}

function transform(commit) {
  commit.type = typeOf(commit.type)
  commit.shortHash = commit.hash.substring(0, 7);
  for (const ref of commit.references) {
    ref.issuesUrl = issuesUrl
  }
  return commit
}

module.exports = {
  parserOpts: {
    noteKeywords: ['BREAKING', 'BREAKING CHANGE', 'BREAKING CHANGES']
  , issuePrefixes: ['LOG-', 'INFRA-', 'REL-']
  , referenceActions: [
      'close', 'closes', 'closed'
    , 'fix', 'fixes', 'fixed'
    , 'resolve', 'resolves', 'resolved'
    ]
  }
, writerOpts: {
    transform: transform
  , commitPartial: templates.commit
  }
, releaseRules: [
    {type: 'build', release: 'patch'}
  , {type: 'ci', release: 'patch'}
  , {type: 'release', release: 'patch'}
  , {type: 'chore', release: 'patch'}
  , {type: 'refactor', release: 'patch'}
  , {type: 'test', release: 'patch'}
  , {type: 'doc', release: 'patch'}
  , {type: 'fix', release: 'patch'}
  , {type: 'lib', release: 'patch'}
  , {type: 'perf', release: 'minor'}
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', null]
  , ['@semantic-release/release-notes-generator', null]
  , ['@semantic-release/changelog', null]

  , ['@codedependant/semantic-release-docker', {
      registry: 'us.gcr.io'
    , project: 'logdna-k8s'
    , tags: ['{major}-latest', '{major}.{minor}-latest', 'latest', '{version}']
    , args: {
        GITHUB_PACKAGES_TOKEN: true
      }
    }]

  , ['@semantic-release/npm', {
      npmPublish: false
    }]

  , ['@semantic-release/git', {
      assets: ['packages.json', 'pnpm-lock.yaml', 'package-lock.json', 'CHANGELOG.md']
    , message: `chore(release): ${year}-${month}-${day}, Version <%= nextRelease.version %> [skip ci]\n\n<%= nextRelease.notes %>`
    }]
  ]
}
