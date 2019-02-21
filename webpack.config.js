const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const modeConfiguration = env => require(`./build-utils/webpack.${env}`)(env);
/**
 * Plugins
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
  const plugins = mode === 'production' ? 
    /**
     * Development mode plugins array.
     */
    [
        new webpack.HotModuleReplacementPlugin()
    ]
    : type === 'example' ? 
    /**
     * Example app plugins array.
     */
    [
      new HtmlWebpackPlugin({
        template: "./public/index.html"
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]
    /**
     * Package app plugins array.
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
              loader: ["url-loader", "file-loader"]
          },
          {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: "babel-loader"
          }
        ]
      },
      devServer: {
        hot: true,
        open: true
      },
      plugins: plugins
    },
    modeConfiguration(mode, type)
  );
}

// Return Array of Configurations
module.exports = ({ mode } = { mode: "production" }) => {
  console.log(`mode is: ${mode}`);

  /**
   * ./src/example/index.js - App to test the application, opens the browser when on development.
   */
  const exampleConfig = Object.assign({}, config(mode, 'example'), {
    name: "example",
    entry: "./src/example/index.js",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
      filename: "bundled.js"
    }
  });

  /**
   * ./src/index.js - Package JavaScript file(s).
   */
  const packageConfig = Object.assign({}, config(mode), {
    name: "package",
    entry: "./src/index.js",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "package"),
      filename: "bundled.js"
    },
  });

  /**
   * Multi-compiler.
   */
  return [
    { mode, ...exampleConfig }, { mode, ...packageConfig },       
  ]
}
