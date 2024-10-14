import parser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

const eslintConfig = [
  {
    // Base configuration for TypeScript
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Your TypeScript rules here
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
  {
    // Base configuration for JavaScript
    files: ['*.js', '*.jsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        // Specify any global variables
      },
    },
    rules: {
      // Your JavaScript rules here
      'no-unused-vars': ['error'],
    },
  },
  {
    // Configuration for React
    files: ['*.jsx', '*.tsx'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      // React specific rules
      'react/react-in-jsx-scope': 'off', // No need for React in scope with React 17+
      'react/prop-types': 'off', // Disable prop-types as we use TypeScript
    },
  },

  {
    "overrides": [
      {
        "files": ["tests/**/*"],
        "plugins": ["jest"],
        "env": {
          "jest/globals": true
        }
      }
    ]
  }
];

export default eslintConfig;
