import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const MAX_FILE_LINES = 200;
const MAX_FUNCTION_LINES = 25;

const noComments = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      comment:
        'Comments are not allowed in this project (CLAUDE.md, "Clean code"). Rename or extract instead.',
    },
  },
  create(context) {
    return {
      'Program:exit'() {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({ loc: comment.loc, messageId: 'comment' });
        }
      },
    };
  },
};

const iccu = { rules: { 'no-comments': noComments } };

const restrict = (...patterns) => ['error', { patterns }];

const boundary = {
  features: {
    group: ['@features/*', '**/features/**'],
    message: 'Only routes/ may import features. Move shared code to core/ or shared/.',
  },
  otherFeatures: {
    group: ['@features/*'],
    message: 'Features must not import other features. Use relative imports inside a feature.',
  },
  coreForShared: {
    group: [
      '@core/*',
      '!@core/http',
      '!@core/http/*',
      '!@core/feedback',
      '!@core/feedback/*',
      '!@core/i18n',
      '!@core/i18n/*',
    ],
    message: 'shared/ may use only core/http, core/feedback and core/i18n.',
  },
  sharedForRoutes: {
    group: ['@shared/*'],
    message: 'routes/ must not import shared/.',
  },
};

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: { iccu },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'iccu/no-comments': 'error',
      'no-console': 'error',
      'max-lines': ['error', { max: MAX_FILE_LINES, skipBlankLines: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: false, ignoreRestArgs: false },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': true, 'ts-ignore': true, 'ts-nocheck': true },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-exports': [
        'error',
        { restrictDefaultExports: { direct: true, named: true, defaultFrom: true } },
      ],
    },
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.test.ts', 'src/test-setup.ts'],
    rules: {
      'max-lines-per-function': ['error', { max: MAX_FUNCTION_LINES, skipBlankLines: true }],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'max-lines': 'off',
    },
  },
  {
    files: ['src/shared/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict(boundary.features) },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict(boundary.features, boundary.coreForShared) },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict(boundary.otherFeatures) },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict(boundary.sharedForRoutes) },
  },
  {
    files: ['*.{js,mjs}', 'scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    plugins: { iccu },
    languageOptions: { globals: globals.node },
    rules: { 'iccu/no-comments': 'error' },
  },
]);
