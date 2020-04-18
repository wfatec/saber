# spec

[![NPM version](https://img.shields.io/npm/v/@saber/spec.svg?style=flat)](https://npmjs.org/package/@saber/spec) [![NPM downloads](http://img.shields.io/npm/dm/@saber/spec.svg?style=flat)](https://npmjs.org/package/@saber/spec)

Easy to use eslint/stylelint/prettier. And spec means specification.

## Features

- [x] eslint
- [x] stylelint
- [x] eslint support TypeScript
- [x] commitlint
- [x] prettier

## Install

```bash
$ npm i --save-dev @saber/spec eslint stylelint @commitlint/cli
```

## Usage

### eslint [rules](/lib/eslint.js)

Create a `.eslintrc.js`

```js
const { eslint } = require('@saber/spec');

module.exports = eslint;
```

### eslint support TypeScript [rules](/lib/tslint.js)

Create a `.eslintrc.js`

```js
const { tslint } = require('@saber/spec');

module.exports = tslint;
```

### stylelint [rules](/lib/eslint.js)

in `.stylelintrc.js`

```js
const { stylelint } = require('@saber/spec');

module.exports = stylelint;
```

### prettier [rules](/lib/prettier.js)

in `.prettierrc.js`

```js
const { prettier } = require('@saber/spec');

module.exports = prettier;
```

### commitlint [rules](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)

in `.commitlintrc.js`

```js
const { commitlint } = require('@saber/spec');

module.exports = commitlint;
```

## FAQ

### Custom config

```js
const { eslint, deepmerge } = require('@saber/spec');

module.exports = deepmerge(eslint, {
  rules: {
    // custom config
  },
});
```

### Error: Cannot find module 'eslint-plugin-foo'

Eslint is not yet supported having plugins as dependencies in shareable config. [issue](https://github.com/eslint/eslint/issues/3458). As a temporary solution, you need add the plugin to devDependencies in your project, like `npm i --save-dev eslint-plugin-jsx-a11y`.

### Warning: incorrect peer dependency "eslint-plugin-react-hooks@^1.7.0"

[issue](https://github.com/airbnb/javascript/issues/2084)