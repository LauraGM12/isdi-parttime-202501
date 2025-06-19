export default {
  testEnvironment: 'node',
  transform: {},
  // Eliminamos esta línea que causa el error
  // extensionsToTreatAsEsm: ['.js'],
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