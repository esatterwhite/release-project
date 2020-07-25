'use strict'
module.exports = {
  dryRun: false
, plugins: [
    '@semantic-release/commit-analyzer'
  , '@semantic-release/release-notes-generator'

  , ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }]

  , ['@semantic-release/git', {
      assets: [
        'packages.json'
      , 'pnpm-lock.yaml'
      , 'CHANGELOG.md'
      ]
    }]
  ]
}
