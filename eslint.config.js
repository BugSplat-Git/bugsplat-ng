const { defineConfig } = require('eslint/config');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const selectorRules = (prefix) => ({
  '@angular-eslint/directive-selector': [
    'error',
    {
      type: 'attribute',
      prefix,
      style: 'camelCase',
    },
  ],
  '@angular-eslint/component-selector': [
    'error',
    {
      type: 'element',
      prefix,
      style: 'kebab-case',
    },
  ],
});

module.exports = defineConfig(
  {
    ignores: ['dist/', 'projects/my-angular-crasher/src/environments/environment.*'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'eol-last': ['error', 'always'],
    },
  },
  {
    files: ['projects/bugsplat-ng/**/*.ts'],
    rules: {
      ...selectorRules('bug'),
      '@angular-eslint/prefer-inject': 'off',
    },
  },
  {
    files: ['projects/my-angular-crasher/**/*.ts'],
    rules: {
      ...selectorRules('app'),
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended],
  },
);
