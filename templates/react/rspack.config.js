const rspack = require("@rspack/core");

const config = {
  entry: {
    main: "./src/main.jsx",
  },

  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
    host: "localhost",
    port: 4173,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [new rspack.HtmlRspackPlugin({ template: "./index.html", favicon: "./public/logo.png" })].filter(
    Boolean
  ),
};

module.exports = config;
