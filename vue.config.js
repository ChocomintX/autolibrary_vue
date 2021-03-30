// module.exports = {
//     publicPath: "/autolibrary", // 公共路径(必须有的)
//     outputDir: "autolibrary", // 输出文件目录
//     assetsDir: "static", //静态资源文件名称
//     lintOnSave: false,
//     productionSourceMap: false, //去除打包后js的map文件
//     devServer: { //启动项目在8080端口自动打开
//         open: true,
//         port: 80,
//         proxy: null
//     },
//     //去掉console
//     configureWebpack: (config) => {
//         // 判断为生产模式下，因为开发模式我们是想保存console的
//         if (process.env.NODE_ENV === "production") {
//             config.optimization.minimizer.map((arg) => {
//                 const option = arg.options.terserOptions.compress;
//                 option.drop_console = true; // 打开开关
//                 return arg;
//             });
//         }
//     },
// };

const path = require('path');

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    runtimeCompiler: true,
    publicPath: "/autolibrary", // 公共路径(必须有的)
    outputDir: "autolibrary", // 输出文件目录
    assetsDir: "static", //静态资源文件名称
    lintOnSave: false,
    devServer: {
        open: true,
        port: 80,
        proxy: null
    },
    configureWebpack:{

        resolve:{
            alias:{
                '@':path.resolve(__dirname, './src'),
                '@i':path.resolve(__dirname, './src/assets'),
            }
        },
        plugins: [

            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            // 下面是下载的插件的配置
            new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100
            })
        ]
    }
}