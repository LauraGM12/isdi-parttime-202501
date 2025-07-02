export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\.\.?\/.+)\.js$': '$1'
  },
  testMatch: ['**/*.spec.js'],
  collectCoverageFrom: [
    'logic/**/*.js',
    '!logic/**/*.spec.js',
    '!**/node_modules/**'
  ],
  verbose: true
};