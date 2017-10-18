/**
 1、启动server,模块热替换
 2、JS模块化开发
 3、编译SASS，less，CSS抽离
 4、Mock数据
 5、版本控制
 6、devtool
 7、合并压缩
 8、环境切换
*/

// 引入webpack
var webpack = require('webpack')

// 引入文本抽离插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// 引入html生成插件
var HtmlWebpackPlugin = require('html-webpack-plugin')

//引入代码压缩
//var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

//var outputDir = ''
//
//if (process.enc.NODE_ENV==='dev') {
//	outputDir='/dev'
//} else {
//	outputDir = '/prd'
//}

module.exports = {
	//配置入口
	entry: {
		'scripts/app': './src/scripts/app.js',
		'scripts/search': './src/scripts/search.js'
	},

	//配置出口
	output: {
		filename: '[name]@[chunkhash:8].js', //@hash是添加版本号
		path: __dirname + '/dev' //必须是绝对路径
	},
	//配置模块
	devServer: {
		host: 'localhost',
		port: 4000,
		contentBase: __dirname + '/dev',
		noInfo: true,
		proxy:{
			'/api':{
				target:'https://www.douban.com/',
				changeOrigin:true,
				pathRewrite: {
		          	'^/api': ''
		        }
			},
			'/vip' :{
				target:'http://localhost:4000/',
				changeOrigin:true,
				pathRewrite:{
					'^/vip':''
				}
			}
		}
	},

	//devtool配置,能在浏览器webpack看到源码

	devtool: 'source-map',

	//配置模块
	module: {
		rules: [
			//解析ES6+ 
			{
				test: /\.js$/,
				exclude: /node_modules/, //排除对这个文件下的js的解析
				use: [{
						loader: 'babel-loader' //应用babel-loader解析ES6+
					}

				]
			},

			//加载scss
			{
				test: /\.scss$/,
				//不抽离，只是用scss。
				/*use:[
					{loader:'style-loader'},
					{loader:'css-loader'},
					{loader:'sass-loader'},
				]*/
				//css抽离
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})

			},
			//加载css
			{
				test: /\.css$/,
				use: [{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			},
			// 加载图片
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: 'images/[name].[hash:8].[ext]'
				}
			},

			// 加载媒体文件
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/[name].[hash:8].[ext]'
				}
			},

			// 加载iconfont
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'iconfont/[name].[hash:8].[ext]'
				}
			}
		]
	},
	//配置插件
	plugins: [
	
		//生成抽离文本插件的实例
		new ExtractTextPlugin({
			filename: (getPath) => {
				return getPath('[name]@[chunkhash:8].css').replace('scripts', 'styles');
			},
			allChunks: true
		}),

		// 生成编译HTML(index.html)的插件的实例
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: ['scripts/app']
		}),
		
		// 生成编译HTML(search.html)的插件的实例
		new HtmlWebpackPlugin({
			template: './src/search.html',
			filename: 'search.html',
			chunks: ['scripts/search']
		}),
		
		//代码压缩
		new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      },
	      output: {
	        comments: false
	      }
	    }),
	]
}