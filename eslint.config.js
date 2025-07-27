const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsparser = require('@typescript-eslint/parser')
const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@stylistic': stylistic,
    },
    rules: {
      // Stylistic specific rules
      '@stylistic/quotes': [
        'error',
        'single',
        { allowTemplateLiterals: 'always' },
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/eol-last': 'error',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',

      // JavaScript/General rules
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-template': 'error',
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['**', '!src/**'],
  },
]
