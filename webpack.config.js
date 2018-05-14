const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const env = process.env.NODE_ENV || 'production';

const config = {
	mode: env,

	devtool: env === 'production' ? false : 'cheap-module-eval-source-map',

	entry: {
		app: './src/app.js',
	},

	output: {
		path: __dirname + "/build",
		filename: "[name].[hash].js"
	},

	devServer: {
		contentBase: "./public", // 本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: false, //实时刷新
		port: 3003
	},

	resolve: {
		modules: [
      __dirname + "/node_modules/"
    ],
		extensions: ['.js', '.jsx', '.json', '.scss'],
		alias: {
			src: path.resolve(__dirname, 'src/')
		},
	},

	optimization: {
		minimize: env === 'production' ? true : false, //压缩js文件的组件，在4.0以上版本已被集成到webpack本身，所以直接填写参数即可
		runtimeChunk: false,
		splitChunks: {
			chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        }
      }
		}
	},

	module: {
		rules: [{
			test: /\.js$/,
			loader: 'eslint-loader',
			enforce: 'pre',
			exclude: /node_modules/,
			options: {
				failOnError: true,
				failOnWarning: false,
			}
		}, { //babel模块的引入
			test: /(\.jsx|\.js)$/,
			use: {
				loader: "babel-loader",
			},
			exclude: /node_modules/
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({ //根据模板自动引入打包之后的js文件
			template: __dirname + "/src/index.html",
			inject: true
		}),
		new webpack.HotModuleReplacementPlugin(), //热加载插件
		new webpack.optimize.OccurrenceOrderPlugin(),  // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
	],
}

module.exports = config;