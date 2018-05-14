## Webpack指南（基于4.5版）
### 前言
用了`webpack`有一段时间了，但是对其貌似缺乏一个具体的了解，最近研究了一下官方文档，在此做一下记录，同时希望能给看到这篇博客的人一些小小的帮助。
### 第一章 概念
什么是`webpack`?  为什么要使用webpack？  
相信很多初学者都会有这个疑问，看了官方的概念也不是很清楚，其实笔者感觉webpack其实没有多么复杂的概念，其主要作用就是打包文件，为什么要打包文件呢？因为打包之后的文件体积会变小，加载起来更快，而且条理更清楚。  
还有就是webpack因为其丰富的扩展性，致使其在开发过程中会基于开发者更多的方便。首当其冲的就是热加载，这个真心在很大程度上方便了开发者的开发。还有一些其他的一些插件，用起来也是美滋滋。
### 第二章 开始
基础概念也就是上面所说到了，笔者只是尽量以最简单的想法去理解webpack。下面就开始基础的项目构建。
#### 2.1 项目的新建
首先，电脑上需要`npm`,国内的话`cnpm`速度会更快些。`windows`系统下需要安装`gitbash`，或者使用自带的`powershell`，这两者都是可以的。  
然后全局安装`webpack`
```
npm i webpack -g
```
接下来新建文件夹，并且初始化`npm`。  
```
mkdir demo && cd demo && npm init 
```
此时在demo文件夹内已经有了`package.json`文件，这是`npm`初始化之后的文件，具体可以访问[官方文档](https://docs.npmjs.com/)。  
在这个时候，很多博客都会教你怎么样使用`webpack`去打包一个或者多个文件，但是那样感觉没有任何意义，实际工作很难想象会有人这样使用`webpack`。所以，接下来我们就直接使用webpack构建一个服务，启动整个项目。  
对了，这个文件夹里面需要放什么东西后面会讲到，现在先空着。
#### 2.2 webpack.config.js的内容
下面会将一些`webpack`的API，这是重点呦。
##### 2.2.1 基础的构建
先安装`webpack`的依赖：
```
npm i webpack webpack-cli -D
```
在项目的跟目录下新建一个`webpack.config.js`文件，然后在里面写上：
```
const webpack = require('webpack');
const path = require('path');

const config = {

}

module.exports = config;
```
基本上就完成了，这么写是有原因的，在下面的章节会讲到。
##### 2.2.2 mode
这个属性是在webpack4.0之后新增的内容，目的就是减少部分属性的填写，使`webpack`更容易上手，无形中减少了一些配置。  
这个属性主要就是有三个值`production`、`development`和`none`，主要就是声明当前是生产模式还是开发模式，也可以不做选择。  
一般情况下就是开发模式喽，但是真正上线的时候要换成生产模式又是很麻烦，所以在这里使用`process.env.NODE_ENV`来判断当前是什么模式，`process.env.NODE_ENV`，其实这里的`process`就是一个全局变量，提供有关信息，控制当前 Node.js 进程。作为一个对象，它对于Node.js应用程序始终是可用的，故无需使用 require()。  
之后的`process.env`就是返回当前项目所在环境的一些信息，是一个对象。当然了，你也可以对这个对象进行一些修改，比方说`process.env.foo = 'bar'`，这些操作其实都是可以的。 那么现在的`process.env.NODE_ENV`其实就是返回当前对象的到底是在生产环境还是在开发环境，所以现在的`webpack.config.js`就变成了这样：
```
const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'production';

const config = {
	mode: env,

}

module.exports = config;
```
判断完当前生产环境是什么之后，`webpack`会自己去添加一些参数，具体参见[官方文档](https://www.webpackjs.com/concepts/mode/)。这一小节也就到此为止了。
##### 2.2.3 entry & output
这两个配置其实是比较基础的，于是就放到一起了。  
从字面意思上来看就是一个入口一个输出，入口其实就是填入口文件的，这句话感觉说的是废话。入口文件是啥呢？其实就是一个总的js文件，就是你可以在这里引入你所需要的其他js文件，不管是`require`还是`import`，`webpack`都是可以解析的，放心的去用。有时候你可能需要多个入口文件，这是就可以将`entry`的参数填成一个数组，像这样：
```
entry: ["./app/entry1", "./app/entry2"]
```
或者
```
entry: {
  a: "./app/entry-a",
  b: ["./app/entry-b1", "./app/entry-b2"]
}
```
输出其实就是你文件打包之后存放的位置，以及对命名上的一些规范，就像这样：
```
output: {
	path: __dirname + "/build",
	filename: "[name].[hash].js"
},
```
这里的`path`就是指定文件打包之后输出的位置，`__dirname`是文件的根目录，下面的`filename`指定了文件打包之后的名字，之所以用`[name]`和`[hash]`的是为了生成问价唯一的ID，在打包的时候，`[name]`会被替换成入口名称，而`[hash]`就是字面的意思，会有一个hash被添加上去。这里的输出还可以同时输出多个，跟上面的入口一样，可以配置一直数组对象。
那么现在的`webpack.config.js`文件就变成了这个样子：
```
const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'production';

const config = {
	mode: env,

	entry: {
		app: './src/app.js',
	},

	output: {
		path: __dirname + "/build",
		filename: "[name].[hash].js"
	},

}

module.exports = config;
```
##### 2.2.4 devtool
这个配置是选择当前`source-map`方式。解释下`source-map`吧。上文已经说过，webpack会打包文件，不管是css,js还是别的什么类型的文件，打包的时候会对文件进行压缩，以减小文件体积。但是压缩之后再chrome等浏览器里就没法调试了，这时就需要`source-map`了，这可是说是打包前代码和打包后代码的桥梁，有个`source-map`就可以正常的进行调试了。`devtool`又有很多种配置方式，具体的内容和速度[官方文档](https://www.webpackjs.com/configuration/devtool/)上有详细的解释。笔者使用的是`cheap-module-eval-source-map`，那么现在的`webpack.config.js`就是这样了：
```
const webpack = require('webpack');
const path = require('path');

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

}

module.exports = config;
```
##### 2.2.5 dev-server
这是关于webpack默认服务的设置，可是设置服务的目录或者修改别的设置。
```
devServer: {
	contentBase: "./public", // 本地服务器所加载的页面所在的目录
	historyApiFallback: true, //不跳转
	inline: false, //实时刷新
	port: 3003
},
```
现在的`webpack.config.js`是这样的：
```
const webpack = require('webpack');
const path = require('path');

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
		contentBase: "./public",
		historyApiFallback: true,
		inline: false, 
		port: 3003
	},
	
}

module.exports = config;
```
##### 2.2.6 resolve
这配置的其实关于模块部分的解析。简单来说就是在引用模块的时候其实会解析出模块的内容，从而进行调用。
笔者的配置是这样的：
```
resolve: {
	modules: [
        __dirname + "/node_modules/",
    ],
	extensions: ['.js', '.jsx', '.json', '.scss'],
	alias: {
		src: path.resolve(__dirname, 'src/')
	},
},
```
`modules`就是模块存在的目录，这里是以数组的方式存在的，因为有的项目依赖可能不存在一个目录下，比方说用了`npm`和`bower`这里模块的目录是不一样的。
`extensions`指的是解析文件的后缀，指定解析的文件的类型可以减少一定时间。
`alias`指定了一个地址的快捷方式，这里将`src/`解析为`src`。这样如果目录较深的时候调用就不用`../../../..`了，直接`src`即可。
那么现在的`webpack.config.js`就是这样了：
```
const webpack = require('webpack');
const path = require('path');

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
		contentBase: "./public",
		historyApiFallback: true,
		inline: false, 
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
	
}

module.exports = config;
```
##### 2.2.7 optimization
此配置是在`webpack4.0`以上的版本中才有的，主要就是集成了`webpack`的部分常用插件。省去了引用插件的部分操作，具体的内容可以查阅另外一个[官方文档](https://zy108830.gitbooks.io/webpack-doc/content/optimization.html)。这里笔者的配置是这样的：
```
optimization: {
	minimize: env === 'production' ? true : false, 
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
```
第一个是压缩js文件的配置，第二个代码分块，按需加载的配置。都是一些默认的配置，官网都有介绍，在此不多做阐述。那么现在的`webpack.config.js`就是下面的样子了，别着急，已经快完了。
```
const webpack = require('webpack');
const path = require('path');

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
		contentBase: "./public",
		historyApiFallback: true,
		inline: false, 
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
		minimize: env === 'production' ? true : false, 
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
	
}

module.exports = config;
```
##### 2.2.8 module
这是`webpack`里面的模块，模块的意思其实就是我们引入的插件，插件就是集合了一定功能的模块。官网的解释是：
> 每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。 精心编写的_模块_提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

这个配置有两个主的配置，一个是`noParse`，这个感觉真的很不常用，但是很有用，就是制定一个正则，然后遇到匹配的就不解析，会节省时间。另外一个就是`rule`啦，这个可以说每个`webpack.config.js`里面都有的。主要就是解析不同的模块，根据不用的文件使用不同的`loader`。这里主讲`rule`。下面是一个`rule`的例子：
```
{
	test: /\.js$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	exclude: /node_modules/,
	options: {
		failOnError: true,
		failOnWarning: false,
	}
}
```
`rule`其实有三个部分，条件、结果和嵌套规则。嵌套规则其实就是`rule`里面的配置。根据配置的不一样会有不一样的结果，这显而易见。条件就是`rule`嵌套规则里面匹配到的文件，比方说`test`、`include`或者`exclude`。下面讲讲嵌套规则。  
嵌套规则的API[官方](https://www.webpackjs.com/configuration/module/#%E5%B5%8C%E5%A5%97%E7%9A%84-rule)给了很详细的解释。在这里也就不画蛇添足啦，讲来讲去也就那点东西，笔者还没有官方说的好。这里的嵌套规则其实现实匹配了相应的文件，之后加上不同的`loader`，进行解析，转化成js形式的文件，以供`webpack`使用。
那么加上了`module`之后的`webpack.config.js`文件现在是这个样子：(这里省略了部分`module`配置，全部加上太长了)
```
const webpack = require('webpack');
const path = require('path');

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
		contentBase: "./public",
		historyApiFallback: true,
		inline: false, 
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
		minimize: env === 'production' ? true : false, 
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
		}]
	},
	
}

module.exports = config;
```
##### 2.2.9 plugins
这里是最后一部分了呦！  
此配置是`webpack`的一些扩展，很多`webpack`没有却十分重要的东西，先安装需要插件的依赖：
```
npm i html-webpack-plugin mini-css-extract-plugin optimize-css-assets-webpack-plugin -D
```
笔者的`plugins`配置如下：
```
plugins: [
	new HtmlWebpackPlugin({ //根据模板自动引入打包之后的js文件
		template: __dirname + "/src/index.html",
		inject: true
	}),
	new webpack.HotModuleReplacementPlugin(), //热加载插件
	new webpack.optimize.OccurrenceOrderPlugin(),  // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
],
```
这些插件后面都有相应的注释，但是要注意一点，在使用插件之前要先在前面引用一下。
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
```
那么最后，`webpack.config.js`就是这个样子了：
```
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
		contentBase: "./public",
		historyApiFallback: true,
		inline: false, 
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
		minimize: env === 'production' ? true : false, 
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
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({ 
			template: __dirname + "/src/index.html",
			inject: true
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
	],
}

module.exports = config;
```
这样，就完成了`webpack.config.js`文件的编写。
#### 2.3 其余的工作
在`webpack.config.js`文件编写完成之后，还需要做一些后续的工作才能真正启动这个项目
##### 2.3.1 依赖的安装
之前提到的各种插件和`loader`都是需要自己手动进行安装的。如果你用了`eslint`，在依赖的安装上就要注意一些问题，不需要`import`之类的引用的文件可以放到`devDependence`里面，其他需要的文件就不能放进去了，因为`eslint`有一条规则就是这样的。  
##### 2.3.2 package.json文件的修改
要启动`webpack`的项目，很重要的一点就是要修改`package.json`文件的`scripts`配置，如果不修改启动起来会很麻烦，而且这里的设置和前面的`process.env.NODE_ENV`呼应起来，在这里可以指定当前是开发模式还是生产模式，这里笔者启动服务使用的是`webpack`的服务组件`webpack-dev-server`，使用前先安装依赖：
```
npm i webpack-dev-server -D
```
笔者的配置是这样的：
```
{
  "name": "Demo",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "rm -rf build && webpack",
    "start": "NODE_ENV=development webpack-dev-server"
  },
}
```
这里有句题外话，就是只有`start`可以通过`npm start`来执行，其他的命令只能通过`npm run XXX`来执行。
##### 2.3.3 eslint的配置
这里的`eslint`使用了据说是最为严格的`airbnb`规则，本来是怂怂的，但是真的用了之后感真的还好，没有想象中的那么难。  
在用了`eslint`之后发现其实这个东西其实还是挺好了，可以在很大程度上规范代码格式，没用之前并没有意识到这个问题。但是`eslint`有时候也是比较麻烦的时候，就死很多东西你没有写完，`eslint`就会报错，这就会导致项目启不来，有点蓝瘦。
在配置之前先安装依赖：
```
npm i eslint eslint-loader babel-eslint eslint-plugin-react -D
npm i eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y -D 
```
配置`eslint`的步骤一般情况下只有两步，第一步是在`webpack.config.js`的`module`中添加`eslint`的规则，就像这样：
```
{
	test: /\.js$/,
	loader: 'eslint-loader',
	enforce: 'pre',
	exclude: /node_modules/,
	options: {
		failOnError: true,
		failOnWarning: false,
	}
}
```
`option`中的设置规定了`error`状态下项目无法运行，但是在`warning`状态下是可以运行的。接下来配置`.eslintrc`文件。下面是笔者的`eslint`配置：
```
{
  "env": {
    "es6": true,
    "browser": true,
    "commonjs": true
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    // 不允许以下划线命名变量或者函数，如果有特殊情况请在下面加上变量名或函数名
    "no-underscore-dangle": ["error", {
      "allow": [
      ]
    }],
    // 后缀可以是js或者是jsx
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prefer-stateless-function": [0, { "extensions": [".js", ".jsx"] }],
    "react/forbid-prop-types": [0],
    // Link组件不用必须加href属性
    "jsx-a11y/anchor-is-valid": [0],
    // 起别名时或者引入lodash时，防止报错
    "import/no-unresolved": [1],
    "import/extensions": [1],
    "react/require-default-props": [0],
    // href="javascript:;"
    "no-script-url": [1],
    //强制闭合标签
    "react/jsx-closing-tag-location": [0]
  }
}
```
##### 2.3.4 babel的配置
`babel`在项目中其实是为了支持最先的`js`语法，`ES6`或者`ES7`完全没有问题。
老规矩，先安装依赖：
```
npm i babel-core babel-loader babel-preset-react babel-preset-env -D
npm i babel-plugin-import babel-plugin-react-transform babel-plugin-transform-class-properties babel-plugin-transform-decorators-legacy babel-preset-react-native-stage-0 -D
```
之后添加`webpack.config.js`中`module`的配置：
```
{
	test: /(\.jsx|\.js)$/,
	use: {
    	loader: "babel-loader",
	},
	exclude: /node_modules/
}
```
因为`babel`的配置可能会比较多，所以在根目录上新建一个`.babelrc`文件用来存放`babel`的配置，笔者的配置如下：
```
{
	"presets": ["react", "env", "stage-0"], 
	"env": {
		"development": {
			"plugins": [
				"transform-decorators-legacy",
				"transform-class-properties",
				["react-transform", {
					"transforms": [{
						"transform": "react-transform-hmr",
						"imports": ["react"],
						"locals": ["module"]
					}]
				}],
				["import", [{"libraryName": "antd", "style": "css"}]]
			]
		}
	}
}
```
先声明了插件的集合，这里有三个`react`、`env`和`stage-0`，`env`选项的值将从`process.env.BABEL_ENV`获取，如果没有的话，则获取` process.env.NODE_ENV`的值，它也无法获取时会设置为`development`。然后`stage-0`是为了防止报错，清别问笔者为什么。  
之后声明了`env`如果是`development`的时候内容，这里主要是插件部分，前两个插件一个是装饰器插件，这个在使用`mobx`的时候会用到，另外一个是声明类时候的插件。再下面就是`react`的插件，主要是用来转化的插件，`react-transform-hmr`是`react`热加载的插件。最后的就是`antd`的引入。
##### 2.3.5 文件的编写
准备工作基本上就完成啦，现在就差启动的时候文件的编写啦，其实很简单的（笔者使用的是`reatc`，要具备`react`的基本知识呦）。然后安下`react`的依赖：
```
npm i react react-dom --save
```
第一步：新建`index.html`文件  
先新建一个`src`文件夹，在根目录下新建`index.html`文件。此文件的作用其实就是提供一个`HTML`的基本架构，没啥内容。
```
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>SmartServing-Admin</title>
  </head>
  <body>
    <div id='app'>
    </div>
  </body>
</html>
```
第二部：编写`react`组件
新建`components`文件夹，在里面新建任意一个组件，比防说一个`demo.js`：
```
import React from 'react';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <p>Hello World!</p>
      </div>
    );
  }
}

export default Demo;
```
第三部：编写`app.js`
在`src`目录下新建`app.js`文件，用来展示组件内容：
```
import React from 'react';
import Demo from './components/demo';

function App() {
  return (
    <div>
      <Demo />
    </div>
  );
}

ReactDom.render(<App />, document.getElementById('app'));
```
那么此时的文件结构是这样的：
```
.
+--_src
|  +--_componets
|     +--demo.js
|  +--index.html
|  +--app.js
+--webpack.config.js
+--.eslintrc
+--.babeltc
+--package.json
```
### 第三章 运行
在第二章我们已经完成了`webpack`的配置和一些文件的编写，那么现在就是测试是否成功的时候了，执行：
```
npm start
```
希望可以一次成功，如果不行就再看看自己哪里有问题吧，有问题可以给笔者发邮件<rexkentzheng@qq.com>。
