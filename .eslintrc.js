module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Integra Prettier con ESLint
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Personaliza tus reglas de ESLint aquí
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'prettier/prettier': 'error',
  },
};
