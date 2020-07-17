'use strict'

module.exports = {
  branches: [
    'master'
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', {
      parserOpts: {
        noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING']
      , issuePrefixes: ['#', 'LOG-', 'REL-', 'INFRA-', 'FAKE-']
      , referenceActions: [
          'close', 'closes', 'closed'
        , 'fix', 'fixes', 'fixed'
        , 'resolve', 'resolves', 'resolved'
        , 'ref:'
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
      , {type: 'compose', release: 'patch'}
      , {type: 'lib', release: 'minor'}
      ]
    }]
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
  , ['@semantic-release/github', {
      labels: ['semantic-release', 'dependant']
    }]
  ]
}
