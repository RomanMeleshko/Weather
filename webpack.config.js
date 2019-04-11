let path = require("path");

let conf = {
  entry: ["./src/index.js"],
  output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "main.js",
      publicPath: "dist/"
  },
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
    
};

module.exports = conf;