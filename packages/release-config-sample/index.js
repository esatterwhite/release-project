'use strict'

module.exports = {
  writerOpts: {
    headerPartial: '{{curretTag}}'
  }
, plugins: [
    ['@semantic-release/commit-analyzer', {
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
    }]

  , ['@semantic-release/release-notes-generator', null]

  , ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }]

  , ['@codedependant/semantic-release-docker', {
      registry: 'docker.pkg.github.com/esatterwhite'
    , imageName: 'release-project/api-service'
    , tags: ['{major}-latest', '{major}.{minor}-latest', 'latest', '{version}']
    , args: {
        GITHUB_PACKAGES_TOKEN: true
      }
    }]

  , ['@semantic-release/npm', {
      npmPublish: true
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
