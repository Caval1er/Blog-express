module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': 'warn',
    'prettier/prettier': 'error',
    'no-console': 'off',
    'import/newline-after-import': 'off',
    'func-names': 'off',
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'no-useless-catch': 'off',
  },
}
