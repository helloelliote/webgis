const { defaults } = require('jest-config');

module.exports = {
  coverageDirectory: '.coverage',
  displayName: {
    name: 'webgis',
    color: 'blue',
  },
  // notify: true,
  timers: 'fake',
};
