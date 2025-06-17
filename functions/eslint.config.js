const js = require('@eslint/js');
const globals = require('globals');
const promise = require('eslint-plugin-promise');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      promise,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...promise.configs.recommended.rules,
      'no-undef': 'error',
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'no-console': 'warn',
    },
  },
];