const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');

const args = getParameters();

function getParameters() {
  // remove first 2 unused elements from array
  let argv = JSON.parse(process.env.npm_config_argv).cooked.slice(2);
  argv = argv.map((arg) => {
    return arg.replace(/--/i, '');
  });
  return argv;
}

module.exports = {
  target: 'node',
  mode: args.indexOf('prod') === 0 ? 'production' : 'development',
  stats: 'errors-warnings',
  entry: {
    app: './bin/www.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '.build'),
    publicPath: './public',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          ecma: 2015,
          module: true,
        },
      }),
    ],
  },
  devtool: 'source-map',
  plugins: [
    new MergeJsonWebpackPlugin({
      files: [
        './package.json',
        './tools/package.json',
      ],
      output: {
        fileName: 'package.json',
      },
    }),
  ],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: [/(node_modules|bower_components)/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime',
            ],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
