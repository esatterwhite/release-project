module.exports = {
  dryRun: false
, branches: [
    'master'
  ]
, plugins: [
    '@semantic-release/commit-analyzer'
  , '@semantic-release/release-notes-generator'

  , ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }]

  , ['@esatterwhite/semantic-release-docker', {
      registry: 'docker.pkg.github.com/esatterwhite'
    , imageName: 'release-project/api-service'
    , args: {
        GITHUB_TOKEN: true
      }
    }]

  , ['@semantic-release/npm', {
      npmPublish: false
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
