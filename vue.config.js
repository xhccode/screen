module.exports = {
    publicPath: "./",
    outputDir: 'dist',
    assetsDir: "static",
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        host: "0.0.0.0", // 设置启动项目网址
        port: 8080, // 设置启动项目端口号
        https: false, // 是否使用https协议
        open: true, // 设置是否自动打开浏览器
        hotOnly: true, // 是否开启热更新
        proxy: {
            '/gis': {
                target: "http://221.228.236.94:9310",
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/gis': '' //需要rewrite的,
                }
            },
            '/apis': {
                target: "http://192.168.1.236:8030",
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/apis': '' //需要rewrite的,
                }
            },
          // "/api-gate-3": {
          //   target: "https://2.16.66.38:8095/",
          //   secure: false,
          //   changeOrigin: true,
          //   onProxyReq: (proxyReq, req) => {
          //     // http请求
          //     // console.log('[HPM] %s %s %s %s', req, '->', proxyReq);
          //   },
          // },
          // "/api-gate": {
          //   target: "https://2.16.66.38:8095/",
          //   secure: false,
          //   changeOrigin: true
          // },
          // "/upmsapi": {
          //   target: "http://219.232.104.100:8066",
          //   changeOrigin: true
          // },
          // "/zhxs": {
          //   target: "http://2.16.66.41:7776",
          //   changeOrigin: true
          // },
          // "/api/sys": {
          //   target: "http://2.16.66.33:8093",
          //   changeOrigin: true
          // },
          // "/api": {
          //   target: "https://2.16.66.38:8095/",
          //   secure: false,
          //   changeOrigin: true
          // },
        }
    },
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             prependData: `@import "./src/assets/css/index.scss";`
    //         }
    //     }
    // }
}
