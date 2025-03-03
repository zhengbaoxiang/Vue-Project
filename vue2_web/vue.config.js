const { defineConfig } = require('@vue/cli-service')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下, // 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将publicPath改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/

const isTest = process.env.VUE_APP_ENV === "testing"
const isProduction = process.env.NODE_ENV === 'production' // 判断是否是生产环境
const publicPath = process.env.VUE_APP_PUBLIC_PATH

const DateString = (new Date().getMonth() + 1) + '-' + new Date().getDate() + '_' + new Date().getHours()+ '_' + new Date().getMinutes()

// 分析打包大小使用默认配置  
let plugins = isTest ? [
    new BundleAnalyzerPlugin()
] : []

//排除打包的js
let externals = {}
//储存cdn的文件
let cdn = {
    css: [],
    js: []
}


// 4 本地开发时用包,打包时排除,生产环境使用cdn
if (isProduction) {
    externals = {
        echarts: 'echarts',
    }
    cdn = {
        css: [
            'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/theme-chalk/index.min.css' // element-ui css 样式表
        ],
        js: [
            // 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js', // vuejs
            // 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.6.0/index.js', // element-ui js
            // 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.6.0/locale/zh-CN.min.js',
            'https://cdn.bootcdn.net/ajax/libs/echarts/5.3.2/echarts.min.js',
        ]
    }
}

module.exports = defineConfig({
    publicPath: publicPath,
    lintOnSave: false,
    transpileDependencies: true,
    productionSourceMap: false,
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        // host: '0.0.0.0', /* 设置为0.0.0.0则所有的地址均能访问 */
        open: true,  // 自动打开浏览器
        port: 8023,  // 默认8080
        /*
        ** 跨域代理
        ** url前置在.env.dev中配置VUE_APP_BASE_APIURL
        */
        proxy: {
            '/nodeApi': {
                target: 'http://localhost:8899/', //
                changeOrigin: true,
                pathRewrite: {
                    '^/nodeApi': ''
                }
            },
            '/baiduApi': {
                target: 'https://aip.baidubce.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/baiduApi': ''
                }
            }
        }
    },
    // 动态调整webpack配置
    chainWebpack: config => {
        // <link rel="prefetch"> 是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。
        // 移除 prefetch 插件
        // config.plugins.delete('prefetch')

        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))

        // 配置cdn给插件,可以在html中,使用变量循环动态引入
        config.plugin('html').tap(args => {
            args[0].cdn = cdn
            console.log('->', cdn, '<');
            return args
        })
        // 例如,如不使用此方法,而是全部引入的话,本地调试时引入cdn资源会略慢,
        // <% for(var js of htmlWebpackPlugin.options.cdn.js) { %>
        //    <script src="<%=js%>"></script>
        // <% } %>



        // 3 代码分离 需要权衡，并不是拆碎了更好,跟宽带也有关。因此暂不启用
        // config.optimization.splitChunks({
        //     cacheGroups: {
        //         common: {
        //             name: 'chunk-common', // 打包后的文件名
        //             chunks: 'all', // 
        //             minChunks: 2,
        //             maxInitialRequests: 5,
        //             minSize: 0,
        //             priority: 1,
        //             reuseExistingChunk: true
        //         },
        //         vendors: {
        //             name: 'chunk-vendors',
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: 'all',
        //             priority: 2,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         iView: {
        //             name: "chunk-iView",
        //             test: /[\\/]node_modules[\\/]view-design[\\/]/,
        //             priority: 4,
        //             chunks: "all",
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         mockjs: {
        //             name: "chunk-mockjs",
        //             test: /[\\/]node_modules[\\/]mockjs[\\/]/,
        //             priority: 4,
        //             chunks: "all",
        //             priority: 3,
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //         echarts: {
        //             name: "chunk-echarts",
        //             test: /[\\/]node_modules[\\/]echarts[\\/]/,
        //             priority: 4,
        //             chunks: "all",
        //             reuseExistingChunk: true,
        //             enforce: true
        //         },
        //     }
        // })

    },
    // 调整 webpack 配置 
    configureWebpack: {
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            // filename: `[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
            filename: `js/[name]_${DateString}_f.js`,       // 此选项决定了每个输出 bundle 的名称
            chunkFilename: `js/[name]_${DateString}_com.js` // 此选项决定了非初始（non-initial）chunk 文件的名称 ；比如路由加载组件
        },

        plugins: plugins,
        // 如打包时无需排除资源,则去掉externals
        externals: externals,
        optimization: {
            splitChunks: {
                // 这表明将选择哪些 chunk 进行优化。当提供一个字符串，有效值为 all，async 和 initial。
                // 设置为 all 可能特别强大，因为这意味着 chunk 可以在异步和非异步 chunk 之间共享。
                chunks: 'async',
                minSize: 5 * 1024,
                // minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 5,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    // 默认配置之后，自定义
                    element: {
                        name: "element-ui",
                        test: /[\\/]element-ui[\\/]/,
                        chunks: "all",
                        priority: 20,
                        reuseExistingChunk: true,
                    },
                    iView: {
                        name: "iView",
                        test: /[\\/]view-design[\\/]/,
                        chunks: "all",
                        priority: 20,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    mockjs: {
                        name: "chunk-mockjs",
                        test: /[\\/]node_modules[\\/]mockjs[\\/]/,
                        chunks: "all",
                        priority: 4,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    echarts: {
                        name: "chunk-echarts",
                        test: /[\\/]node_modules[\\/]echarts[\\/]/,
                        chunks: "all",
                        priority: 4,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    common: {
                        name: 'chunk-common', // 打包后的文件名
                        chunks: 'all', // 
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true
                    },
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: 2,
                        reuseExistingChunk: true,
                        enforce: true
                    },


                }
            }
        },
        // 若要兼容ie11则打开此项 
        module: {
            rules: [
                // 'transform-runtime' 插件告诉 Babel
                // 要引用 runtime 来代替注入。
                {
                    test: /\.m?js$/,
                    include: [
                        resolve('src'),
                        resolve('test'),
                        resolve('node_modules/webpack-dev-server/client'),
                        resolve('node_modules/iview/src'),
                        resolve('node_modules/tree-table-vue/lib'),
                        resolve('node_modules/v-org-tree/dist')
                    ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
    },

    // 有的时候你想要向 webpack 的预处理器 loader 传递选项。
    // 可以使用 vue.config.js 中的 css.loaderOptions 选项。
    //这样向所有 Sass/Less 样式传入共享的全局变量：
    css: {
        loaderOptions: {
            // @/ 是 src/ 的别名
            //  // 给 sass-loader 传递选项
            //   sass: {
            //     // 所以这里假设你有 `src/variables.sass` 这个文件
            //     // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
            //     additionalData: `@import "~@/variables.sass"`
            //   },
            //   // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
            //   // 因为 `scss` 语法在内部也是由 sass-loader 处理的
            //   // 但是在配置 `prependData` 选项的时候
            //   // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
            //   // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
            //   scss: {
            //     additionalData: `@import "~@/variables.scss";`
            //   },
            // 给 less-loader 传递 Less.js 相关选项
            less: {
                // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
                // `myprimary` is global variables fields name,全局可用了
                globalVars: {
                    myprimary: 'rgb(229, 255, 0)',

                    // 如果引用整个文件的话 这种方式最简单，无需安装style-resources-loader。
                    hack: `true; @import '~@/assets/style/globalvar.less';`
                }
            }
        }
    }

})
