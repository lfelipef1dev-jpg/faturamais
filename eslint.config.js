import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['*.js'],
  ignores: ['build.js', 'playwright.config.js', 'eslint.config.js', 'out/**', 'node_modules/**', 'tests/**'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
    globals: {
      window: 'readonly',
      document: 'readonly',
      localStorage: 'readonly',
      console: 'readonly',
      setTimeout: 'readonly',
      clearTimeout: 'readonly',
      Math: 'readonly',
      Date: 'readonly',
      JSON: 'readonly',
      Array: 'readonly',
      Object: 'readonly',
      Number: 'readonly',
      String: 'readonly',
      Boolean: 'readonly',
      parseInt: 'readonly',
      isNaN: 'readonly',
      Faturamais: 'writable',
      FaturamaisData: 'readonly',
      FaturamaisViews: 'readonly',
    },
  },
  rules: {
    'no-unused-vars': ['warn', { caughtErrorsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-console': 'off',
  },
});
