const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: "./node_modules/angular/angular.js", to: "angular.js"},
        {from: "./node_modules/underscore/underscore.js", to: "underscore.js"},
        {from: "./node_modules/bootstrap/dist/css/bootstrap.css", to: "bootstrap.css"},
        {from: "./app/*", to: "."},
      ],
    }),
  ],

  optimization: {
    minimize: false
  },
};
