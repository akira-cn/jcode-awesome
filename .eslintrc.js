module.exports = {
  globals: {
    globalThis: true,
    JCode: true,
  },
  extends: 'eslint-config-sprite',
  rules: {
    complexity: ['warn', 25],
    'no-unused-vars': 'warn',
    'no-restricted-globals': 'off',
    'max-params': ['warn', 7],
    'import/no-anonymous-default-export': 'off',
    'no-console': 'warn',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
  },
};
