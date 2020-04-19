const { join } = require("path");
const fs = require("fs");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const terser = require("rollup-plugin-terser").terser;

const terserOptions = {
  mangle: {
    eval: true,
    module: true,
    safari10: true,
    toplevel: true
  },
  parse: {
  },
  compress: {
    unsafe: true,
    arguments: true,
    hoist_funs: true,
    hoist_props: true,
    keep_fargs: false,
    negate_iife: true,
    module: true,
    pure_getters: true,
    passes: 2,
    sequences: 400,
    toplevel: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_math: true,
    unsafe_symbols: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_undefined: true
  },
  ecma: 5, // specify one of: 5, 2015, 2016, 2017 or 2018
  keep_classnames: false,
  keep_fnames: false,
  ie8: false,
  module: true,
  nameCache: null, // or specify a name cache object
  safari10: true,
  toplevel: true,
  warnings: false
}

function baseConfig(name, isMin) {
  return {
    input: `src/${name}.js`,
    output: [
      {
        file: `lib/${name}${isMin ? '.min' : ''}.js`,
        format: "umd",
        name,
        sourcemap: isMin,
      }
    ],
    plugins: [
      resolve({
        // preferBuiltins: false,
      }),
      commonjs(),
      babel({
        babelrc: false,
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
        ],
      }),
      isMin && terser(terserOptions)
    ],
  };
}

function rollup() {
  const target = process.env.TARGET;

  return [baseConfig('index', false)];
}
module.exports = rollup();
