const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackConfig = {
    title: 'azusa',
    filename: 'index.html',
    template: "./src/index.html",
    hash: true,
    showErrors: true
};

module.exports = {
    entry: [
        "@babel/polyfill",
        "./src/example.ts"
    ],
    output: {
        filename: "example.js",
        path: __dirname + "/example"
    },

    devtool: "source-map",

    plugins: [
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
        new HtmlWebpackPlugin(HtmlWebpackConfig)
    ],

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: "ts-loader",
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, "node_modules"),
                use: [{
                    loader: 'babel-loader'
                }],
            },
            {
                test: /\.(ts|js)$/,
                enforce: "pre",
                use: [{ loader: 'source-map-loader' }]
            }
        ]
    },

    devServer: {
		port: process.env.PORT || 8888,
		host: 'localhost',
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		open: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//   target: 'http://target-host.com',
			//   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
}