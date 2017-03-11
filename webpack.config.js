var webpack = require("webpack");//必须引入
// var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  devtool: 'eval-source-map',

  entry:  __dirname + "/app/reactmain.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  module: {//在配置文件里添加JSON loader
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'//添加对样式表的处理

      }
    ]
  },
    plugins: [
      // new webpack.HotModuleReplacementPlugin()//热加载插件
      new webpack.BannerPlugin({banner: '//自动构建文件', raw: true, entryOnly: true}),
      //new ExtractTextPlugin("style.css")
  ],

  devServer: {
    contentBase: "./public",
    //colors: true,
    historyApiFallback: true,
    inline: true
  }
}