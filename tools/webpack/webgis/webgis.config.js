const path = require('path');

const distPath = path.resolve(__dirname, '../../..', '.build');
const viewPath = path.resolve(__dirname, 'views');

const rootPath = path.resolve('webpack', 'webgis');
const jsPath = path.resolve(rootPath, 'javascript');
const cssPath = path.resolve(rootPath, 'stylesheet');
const mediaPath = path.resolve(rootPath, 'media');

const jsMapsPath = path.resolve(jsPath, 'maps');
const jsServicePath = path.resolve(jsPath, 'service');

const webpackEntries = {
  'js/maps.bundle': [
    path.resolve(jsPath, 'index.js'),
    path.resolve(jsMapsPath, 'index.js'),
  ],
  'js/serv.register': [
    path.resolve(jsPath, 'index.js'),
    path.resolve(jsServicePath, 'register', 'kakaoMap.js'),
    path.resolve(jsServicePath, 'register', 'index.js'),
  ],
  'js/serv.search': [
    path.resolve(jsPath, 'index.js'),
    path.resolve(jsServicePath, 'search', 'kakaoMap.js'),
    path.resolve(jsServicePath, 'search', 'index.js'),
  ],
  'js/serv.pres': [
    path.resolve(jsServicePath, 'pres-manage.js'),
  ],
  'js/serv.schedule': [
    path.resolve(jsServicePath, 'schedule.js'),
  ],
  'css/custom.bundle': [
    path.resolve(cssPath, '_init.scss'),
  ],
};

/**
 * @link https://webpack.js.org/plugins/copy-webpack-plugin/
 */
const webpackCopy = {
  view: {
    from: viewPath,
    to: path.resolve(distPath, 'views'),
  },
  media: {
    from: mediaPath,
    to: path.resolve(distPath, 'public', 'assets', 'media'),
  },
};

/**
 * @link https://webpack.js.org/configuration/module/#rule
 */
const webpackRules = {
  js: {
    test: /\.m?js$/,
    exclude: [/(node_modules|bower_components)/, /__tests__/],
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current', // !!!DO NOT REMOVE!!!
            },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
      ],
      cacheDirectory: true,
      rootMode: 'upward',
    },
  },
  worker: {
    test: /.*\.worker\..*$/,
    use: {
      loader: 'worker-loader',
      options: {
        inline: 'no-fallback',
      },
    },
  },
};

module.exports = {
  distPath,
  webpackEntries,
  webpackCopy,
  webpackRules,
};
