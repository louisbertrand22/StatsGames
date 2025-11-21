module.exports = {
  extends: ['expo', 'eslint:recommended'],
  env: {
    browser: true,
    es2021: true,
    node: true,
    'react-native/react-native': true,
    jest: true, // Enable Jest globals
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-native'],
  rules: {
    // Possible errors
    'no-console': 'warn',
    'no-debugger': 'warn',
    
    // Best practices
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'warn',
    
    // React specific
    'react/prop-types': 'off', // We're not using TypeScript or PropTypes
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    
    // React Native specific
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
