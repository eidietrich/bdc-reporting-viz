const webpack = require('webpack');
const path = require('path');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin');

let config = {
  'entry': './app/index.js',
  'output': {
    path: path.resolve(__dirname, './build'),
    filename: 'output.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.jpeg', '.jpg', '.gif', '.png'],
    alias: {
      images: path.resolve(__dirname, 'app/images')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        }],
        exclude: /node_modules/,
        include: __dirname,
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('styles.css'),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './build'),
    historyApiFallback: true,
    inline: true,
    open: true
  },
  devtool: 'eval-source-map'
}

module.exports = config;

// production mode
if (process.env.NODE_ENV === 'production'){
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssets()
  );
}