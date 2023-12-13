const rspack = require("@rspack/core");
const { VueLoaderPlugin } = require("vue-loader");

/** @type {import('@rspack/cli').Configuration} */
const config = {
	context: __dirname,
	entry: {
		main: "./src/main.js"
	},
	devServer: {
   port: 5173,
   host: "localhost",
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					experimentalInlineMatchResource: true
				}
			},
			{
				test: /\.ts$/,
				loader: "builtin:swc-loader",
				options: {
					sourceMap: true,
					jsc: {
						parser: {
							syntax: "typescript"
						}
					}
				},
				type: "javascript/auto"
			},
			{
				test: /\.less$/,
				loader: "less-loader",
				type: "css"
			},
			{
                test: /\.(png|svg|jpg|webp)$/,
				type: "asset/resource"
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new rspack.HtmlRspackPlugin({
			title: "Cronos | Next Generation Fullstack Tooling",
			template: "./index.html",
            favicon: "./public/cronos.webp" 
		})
	],
};
module.exports = config;