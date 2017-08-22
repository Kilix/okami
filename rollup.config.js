import bundleSize from 'rollup-plugin-bundle-size'
import sizes from 'rollup-plugin-sizes'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const babelConfig = {
  exclude: ['node_modules/**'],
  babelrc: false,
  presets: [['env', { modules: false }], 'stage-2', 'react'],
  plugins: ['external-helpers'],
}

export default [
  // browser-friendly UMD build
  {
    entry: 'src/index.js',
    dest: pkg.browser,
    format: 'umd',
    moduleName: 'react-calendar',
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs({
        namedExports: {
          'node_modules/react/react.js': ['Component'],
        },
      }),
      babel(babelConfig),
      sizes(),
      bundleSize(),
    ],
  },
  {
    entry: 'src/index.js',
    targets: [
      { dest: pkg.main, format: 'cjs' },
      { dest: pkg.module, format: 'es' },
    ],
    external: ['react', 'recompose', 'debounce', 'prop-types', 'date-fns'],
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
    },
    plugins: [babel(babelConfig)],
  },
]
