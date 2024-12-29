module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'sonarjs'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/cognitive-complexity': ['error', 20],
    'sonarjs/no-duplicate-string': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-vars': 'off',  // Use TypeScript's checker instead
    '@typescript-eslint/no-unused-vars': ['warn']  // Warning only
  },
};
