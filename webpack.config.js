const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const modeConfiguration = env => require(`./build-utils/webpack.${env}`)(env)
/**
 * Plugins
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

/**
 * Separating the output path by using the multi-compiler. (i.e. separating the configuration object of webpack.config.js).
 * The mode argument will be received from the module export, the type argument means will result in the mode configuration
 * being set for the NPM package or for the example bundle.
 */
const config = (mode, type = 'package') => {
  /**
   *
   * Here, we required the webpack-merge package, then we created a function modeConfiguration that
   * loads the configuration that matches the mode we’re in. We’ll pass modeConfiguration as the
   * second argument to webpackMerge. webpackMerge then adds configurations from it to the generic
   * configuration.
   * https://blog.logrocket.com/versatile-webpack-configurations-for-your-react-application-e6ebf6615cc
   */

  /**
   * The plugins will vary depending on which mode we are on (production or development) or,
   * which package is being built (example or package).
   * If building the example, we don't need to optimize neither JavaScript or CSS/SCSS. Only
   * HotModuleReplacementPlugin (to save state between changes) and HtmlWebpackPlugin (to open the index.html that hosts
   * the example app).
   */
  const plugins = type === 'example'
      /**
       * Example app plugins.
       */
      ? [
        new HtmlWebpackPlugin({
          template: './public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['build/*.*']),
        new MiniCssExtractPlugin()
      ]
      /**
       * Package plugins.
       */
      : mode === 'production'
        ? 
          /**
           * Production mode.
           */
          [
            new MiniCssExtractPlugin(),
            /**
             * Removes all files in 'dist' & 'build' folder.
             * https://github.com/johnagan/clean-webpack-plugin#paths-required
             */
            // new CleanWebpackPlugin(['dist/*.*'], { exclude: ['index.js'] })
          ]
          /**
           * Development mode.
           */
          : [
            new MiniCssExtractPlugin()
          ]

  /**
   * We defined generic configurations to avoid code repetition, which is good practice. Now, we need to add the specific
   * configurations to the generic config depending on which script we run. To achieve this, we need a way to concatenate
   * both configurations. Webpack-merge does exactly that. If there is a clash of properties in our webpack.config.js,
   * it would be overwritten by the incoming property.
   * https://blog.logrocket.com/versatile-webpack-configurations-for-your-react-application-e6ebf6615cc
   */
  return webpackMerge(
    {
      module: {
        rules: [
          {
            test: /\.jpe?g|png$/,
            exclude: /node_modules/,
            loader: ['url-loader', 'file-loader']
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }
        ]
      },
      devServer: {
        hot: true,
        open: true
      },
      plugins: plugins
    },
    modeConfiguration(mode)
  )
}

// Return Array of Configurations
module.exports = ({ mode } = { mode: 'production' }) => {
  console.log(`mode is: ${mode}`)

  /**
   * ./src/example/index.js - App to test the application, opens the browser when on development.
   */
  const exampleConfig = Object.assign({}, config(mode, 'example'), {
    entry: path.resolve(__dirname, 'example/index.js'),
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js'
    },
    stats: 'errors-only'
  })

  /**
   * ./src/index.js - Package JavaScript file(s).
   */
  const packageConfig = Object.assign({}, config(mode), {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      publicPath: '/dist/',
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      chunkFilename: '[name].[contenthash:6].js',
      /**
       * When used in tandem with output.library and output.libraryTarget, this option allows users to
       * insert comments within the export wrapper. To insert the same comment for each libraryTarget type,
       * set auxiliaryComment to a string.
       * https://webpack.js.org/configuration/output/#outputauxiliarycomment
       */
      library: '',
      libraryTarget: 'commonjs2'
      /**
       * Another possible output config using UMD (Universal Module Definition) patterns for
       * JavaScript modules that work everywhere:
       * https://github.com/webpack/webpack/issues/2030#issuecomment-359910066
       * http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6
       * https://github.com/umdjs/umd
       */
      // library: 'react-png-component',
      // libraryTarget: 'umd',
      // umdNamedDefine: true
    },
    stats: {
      colors: true,
      errors: true,
      errorDetails: true,
      chunks: true,
      timings: true,
      publicPath: true,
      warnings: true,
      hash: false,
      version: false,
      assets: false,
      chunkModules: false,
      chunkOrigins: false,
      chunkGroups: false,
      modules: false,
      reasons: false,
      moduleTrace: false,
      children: false,
      source: false
    }
  })

  /**
   * Do NOT modify the array order, read right-to-left. Package config will be built first.
   */
  return [
    /**
   * Multi-compiler.
   */
    { mode, ...exampleConfig }, { mode, ...packageConfig }
  ]
}
