/******************************************************************************/

import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import globals from 'globals';

/******************************************************************************/

export default [
  { ignores: ['dist', 'node_modules', 'client/output/**/**'] },

  {
    files: ['client/src/**/*.{js,jsx}'],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        __CANNED_REQUESTS__: 'readonly',
        __CLERK_PUBLISHABLE_KEY__: 'readonly',
        __COMMIT_HASH__: 'readonly',
        __APP_VERSION__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    },
  },

  {
    files: ['vite.config.js', 'eslint.config.js', 'prettier.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // IMPORTANT: Add eslint-config-prettier as the VERY LAST configuration. This
  // ensures it turns off any conflicting stylistic rules from other configs.
  eslintConfigPrettier,
];

/******************************************************************************/
