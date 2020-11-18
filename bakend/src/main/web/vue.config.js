const path = require("path");

const resolve = dir => {
    return path.join(__dirname, dir);
};

const BASE_URL = process.env.NODE_ENV === "production"
    ? "/static/"
    : "/";

module.exports = {
    // Project deployment base
    "publicPath": BASE_URL,
    "outputDir": "../webapp/static/",
    "devServer": {
        "port": 8008 // 端口
    },
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    "lintOnSave": true,
    "chainWebpack": config => {
        config.resolve.alias
            .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set("_c", resolve("src/components"))
            .set("_m", resolve("src/mixins"));
    },
    // 设为false打包时不生成.map文件
    "productionSourceMap": false,
    "css": {
        "sourceMap": true // 开启 CSS source maps
    },
    "configureWebpack": (config) => { 
        config.externals={
            "vue": "Vue"
        };
        config.module.rules.push({ 
            "test": /\.vue$/, 
            "use": [{ 
                "loader": "iview-loader", // 解决ivew组件 忽略前缀i的问题 
                "options": { 
                    "prefix": false 
                } 
            }] 
        });
    }
};
