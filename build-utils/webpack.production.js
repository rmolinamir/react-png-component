const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = () => ({
  devtool: 'nosource-source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps for css
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.sa?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: require.resolve('react')
    }
  },
  // This line is just to use the React dependency of our parent-testing-project instead of using our own React.
  externals: {
    'react': 'commonjs react'
  }
})
