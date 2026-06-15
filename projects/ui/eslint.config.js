// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      // This is a component library: directives are intentionally exposed as
      // both element selectors (e.g. `<tw-tabs>`) and attribute selectors
      // (e.g. `<button tw-button>`, Material-style), all kebab-case.
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          prefix: 'tw',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'tw',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    // The tooltip is exposed as a camelCase attribute (`twTooltip="..."`),
    // matching the established Angular ecosystem convention (cf. `matTooltip`).
    files: ['**/tooltip/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'tw',
          style: 'camelCase',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
]);
