module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'es2020': true,
    'jquery': true,
    'jest': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'rules': {
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'quotes': ['warn', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'semi': ['warn'],
    'no-unused-vars': ['warn'],
    // 'array-bracket-spacing': [ 'warn', 'always', {'singleValue': false} ],
    'object-curly-spacing': ['warn', 'always'],
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    'space-before-function-paren': ['warn', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'arrow-spacing': ['warn'],
    'comma-dangle': ['warn', 'always-multiline'],
  },
};
