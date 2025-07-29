const js = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin')

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
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

      // JavaScript rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-template': 'error',
      'prefer-const': 'error',
    },
  },
]
