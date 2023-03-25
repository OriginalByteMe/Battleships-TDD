
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	mode: "development",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/,
				use: ["html-loader"],
			},
		]
	},
	devServer: {
		static: {
      directory: path.join(__dirname, 'src'),
    },
		compress: true,
		port: 8000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],
};
