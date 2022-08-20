const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: {
    background: ['@babel/polyfill', './src/scripts/background.js'],
    popup: ['@babel/polyfill', './src/scripts/popup.js'],
    notification: ['@babel/polyfill', './src/scripts/notification.js'],
    content: './src/scripts/content-script.js',
    injector: './src/scripts/injector.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPattern: [path.join(process.cwd(), 'dist', '*')],
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: path.join(process.cwd(), 'dist'),
          context: 'src',
        },
        {
          from: 'popup.html',
          to: path.join(process.cwd(), 'dist'),
          context: 'src',
        },
        {
          from: 'notification.html',
          to: path.join(process.cwd(), 'dist'),
          context: 'src',
        },
        {
          from: 'images',
          to: path.join(process.cwd(), 'dist', 'images'),
          context: 'src',
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: ['vue-loader', 'vue-svg-loader'],
      },
      {
        test: /\.vue$/,
        // include: path.resolve(__dirname, 'src'),
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires >= sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                // indentedSyntax: true, // optional
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.vue', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist', 'scripts'),
  },
};
