export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\.\.\/\/.+)\.js$': '$1'
  },
  testMatch: [
    '**/logic/reviews/getUserReviews.spec.js'
  ],
  collectCoverageFrom: [
    'logic/reviews/getUserReviews.js',
    '!**/*.spec.js',
    '!**/node_modules/**',
    '!**/index.js'
  ],
  verbose: true,
  testTimeout: 10000,
};