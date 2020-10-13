const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Handlebars = require('handlebars')

module.exports = {
  entry: './src/index.js',
  devServer: {
    open: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    })
  ],

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader'
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff2?|otf|svg|png|jpg)$/,
        loaders: ['file']
      }
    ]
  }
}
