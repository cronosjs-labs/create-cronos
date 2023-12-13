const rspack = require("@rspack/core");
/** @type {import('@rspack/cli').Configuration} */
const config = {
	entry: {
		main: "./src/main.jsx"
	},
	devServer: {
		host: "localhost",
		port: 4173,
		allowedHosts: "all",
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg)$/,
				type: "asset/resource"
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			title: "Cronos | Next Generation Fullstack Tooling",
			template: "./index.html",
			favicon: "./public/cronos.webp"
		})
	]
};
module.exports = config;