const npsUtils = require('nps-utils')

const series = npsUtils.series
const concurrent = npsUtils.concurrent
const rimraf = npsUtils.rimraf
const crossEnv = npsUtils.crossEnv

module.exports = {
  scripts: {
    test: {
      default: crossEnv('NODE_ENV=test jest --coverage'),
      update: crossEnv('NODE_ENV=test jest --coverage --updateSnapshot'),
      watch: crossEnv('NODE_ENV=test jest --watch'),
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(rimraf('dist'), 'rollup -c'),
      watch: 'rollup -c -w',
    },
    lint: {
      default: 'eslint .',
      fix: 'eslint . --fix',
    },
    format: {
      description: 'format the entire project',
      script: "prettier --write 'src/*/*.js' 'stories/*/*.js'",
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: concurrent.nps('lint', 'test'),
    },
    storybook: {
      description: 'launch storybook in local',
      default: 'start-storybook -p 9001 -c .storybook',
      deploy: 'storybook-to-ghpages',
    },
  },
  options: {
    silent: false,
  },
}
