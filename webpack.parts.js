const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabelWebpackPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

exports.extractCSS = ({ include, exclude, use }) => {
	// Output extracted CSS to a file
	const plugin = new ExtractTextPlugin({
		filename: 'style.css',
	});

	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,

					use: plugin.extract({
						use,
						fallback: 'style-loader',
					}),
				},
			],
		},
		plugins: [plugin],
	};
};

exports.autoprefix = () => ({
	loader: 'postcss-loader',
	options: {
		plugins: () => [require('autoprefixer')()],
	},
});

exports.loadJavaScript = ({ include, exclude }) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include,
				exclude,

				loader: 'babel-loader',
				options: {
					// Enable caching for improved performance during
					// development.
					// It uses default OS directory by default. If you need
					// something more custom, pass a path to it.
					// I.e., { cacheDirectory: '<path>' }
					cacheDirectory: true,
				},
			},
		],
	},
});

exports.clean = path => ({
	plugins: [new CleanWebpackPlugin([path])],
});

exports.minifyJavaScript = () => ({
	plugins: [new BabelWebpackPlugin()],
});

exports.minifyCSS = ({ options }) => ({
	plugins: [
		new OptimizeCSSAssetsPlugin({
			cssProcessor: cssnano,
			cssProcessorOptions: options,
			canPrint: false,
		}),
	],
});

exports.setFreeVariable = (key, value) => {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [new webpack.DefinePlugin(env)],
	};
};

exports.page = ({ path = '', entry } = {}) => ({
	entry,
});
