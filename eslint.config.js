const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const nodePlugin = require('eslint-plugin-n');
const importXPlugin = require('eslint-plugin-import-x');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({ ...config, files: ['**/*.ts'] })),
  { ...nodePlugin.configs['flat/recommended-script'], files: ['**/*.ts'] },
  { ...importXPlugin.flatConfigs.recommended, files: ['**/*.ts'] },
  { ...importXPlugin.flatConfigs.typescript, files: ['**/*.ts'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-process-exit': 'error',
      // Noisy under esModuleInterop with CJS libs that have both a default and named exports (express, dotenv, pino...)
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-named-as-default': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'n/no-missing-require': 'off',
    },
  },
  {
    files: ['seeds/**/*.ts'],
    rules: {
      'no-console': 'off',
      'n/no-process-exit': 'off',
    },
  },
  {
    files: ['migrations/**/*.ts'],
    rules: {
      '@typescript-eslint/require-await': 'off',
    },
  },
);
