'use strict'

module.exports = {
  branches: [
    'master'
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', null]
  , ['@semantic-release/release-notes-generator', null]
  , ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }]
  , ['@semantic-release/npm', null]
  , ['@semantic-release/git', {
      assets: [
        'package.json'
      , 'CHANGELOG.md'
      , 'pnpm-lock.yaml'
      ]
    }]
  ]
}
