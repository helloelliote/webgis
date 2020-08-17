module.exports = {
  rootDir: '../',
  coverageDirectory: '.coverage',
  displayName: {
    name: 'webgis',
    color: 'blue',
  },
  notify: true,
  timers: 'fake',
  setupFiles: [
    '<rootDir>/.jest/jest.env.js',
  ],
};
