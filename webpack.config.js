const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
	app: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'components'),
};

const commonConfig = merge([
	{
		output: {
			path: PATHS.build,
			filename: 'Visualization.js',
		},
	},
	parts.loadJavaScript({ include: PATHS.app }),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
]);

const productionConfig = merge([
	{
		performance: {
			hints: 'warning', // 'error' or false are valid too
			maxEntrypointSize: 100000, // in bytes
			maxAssetSize: 450000, // in bytes
		},
		output: {
			chunkFilename: 'Visualization.js',
			filename: 'Visualization.js',
		},
		plugins: [new webpack.HashedModuleIdsPlugin()],
	},
	parts.clean(PATHS.build),
	parts.minifyJavaScript(),
	parts.minifyCSS({
		options: {
			discardComments: {
				removeAll: true,
				// Run cssnano in safe mode to avoid
				// potentially unsafe transformations.
				safe: true,
			},
		},
	}),
	parts.setFreeVariable('process.env.NODE_ENV', 'production'),
]);

const developmentConfig = merge([
	{
		output: {
			devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
		},
		watch: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: /node_modules/,
		},
	},
]);

module.exports = env => {
	const pages = [
		parts.page({
			entry: {
				app: PATHS.app + '/bubbles',
			},
		}),
	];
	const config = env === 'production' ? productionConfig : developmentConfig;

	return merge([commonConfig, config].concat(pages));
};
