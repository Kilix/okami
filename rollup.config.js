import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const babelConfig = {
  exclude: ['node_modules/**'],
  babelrc: false,
  presets: [['env', {modules: false}], 'stage-2', 'react'],
  plugins: ['external-helpers'],
}

export default [
  {
    name: 'okami',
    input: 'src/index.js',
    output: {file: pkg.browser, format: 'umd'},
    external: ['react', 'recompose', 'debounce', 'prop-types', 'date-fns', 'pomeranian-durations'],
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      recompose: 'recompose',
      'pomeranian-durations': 'pomeranianDurations',
    },
    plugins: [
      json(),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/react/react.js': ['Component'],
          'node_modules/pomeranian-durations/lib/index.js': ['asHours'],
        },
      }),
      babel(babelConfig),
    ],
  },
  {
    input: 'src/index.js',
    external: ['react', 'recompose', 'debounce', 'prop-types', 'date-fns', 'pomeranian-durations'],
    output: [{file: pkg.main, format: 'cjs'}, {file: pkg.module, format: 'es'}],
    plugins: [json(), babel(babelConfig)],
  },
]
