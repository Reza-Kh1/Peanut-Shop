// eslint.config.mjs
import { flatConfig } from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  flatConfig,
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        project: './tsconfig.json', // مسیر tsconfig پروژه
        tsconfigRootDir: import.meta.url.replace('file://', ''),
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/typedef': [
        'error',
        { variableDeclaration: true, arrowParameter: true, memberVariableDeclaration: true }
      ],
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      // '@typescript-eslint/no-explicit-any': 'off',
    }
  },
];
