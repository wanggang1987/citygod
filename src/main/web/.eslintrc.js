module.exports = {
    "root": true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
    "parserOptions": {// 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
        "parser": "babel-eslint", // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
        "sourceType": "module"
    },  
    "env": { // 此项指定环境的全局变量，下面的配置指定为浏览器环境 
        "browser": true,
        "node": true,
        "es6": true
    },
    "globals": {
        "Vue": true,
        "BMap": true,
        "BMapLib": true
    },
    "extends": [
        "plugin:vue/essential",
        "eslint:recommended"
    ], // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错 
    "plugins": ["vue"], // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的 
    "rules": {
        "vue/no-parsing-error": [
            2,
            {
                "x-invalid-end-tag": false
            }
        ],
        "indent": ["error", 4, { "SwitchCase": 1 }],  // 缩进4 
        "comma-dangle": 2, // 对象字面量项尾不能有逗号 
        "no-console": 0, // 禁止使用console 
        "no-extra-semi": 0, // 禁止多余的冒号
        // "no-new": 1, // 禁止在使用new构造一个实例后不赋值
        "no-undef": 1, // 不能有未定义的变量
        "no-undef-init": 2, // 变量初始化时不能直接给它赋值为undefined
        // "no-undefined": 2, // 不能使用undefined
        "quote-props": [2, "always"],//对象字面量中的属性名是否强制双引号
        "quotes": ["error", "double"],//引号类型 `` "" ''
        "semi": [2, "always"], // 语句强制分号结尾 
        "eqeqeq": 0, // 必须使用全等
        "no-unused-expressions": "off", // 禁止无用的表达式
        "generator-star-spacing": "off", // 生成器函数*的前后空格 
        "no-unused-vars": 0, //不能有声明后未被使用的变量或参数,
        "vue/jsx-uses-vars": 2,
        "curly": [ // 在if-else语句中，如果if或else语句后面是多行，那么必须加大括号。如果是单行就应该省略大括号。
            2,
            "multi-line"
        ],
        "keyword-spacing": [ // keyword 前后需要空格 
            2, 
            { 
                "before": true, 
                "after": true, 
                "overrides": {} 
            }
        ],
        "key-spacing": [ // 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格
            2, 
            { 
                "beforeColon": false, 
                "afterColon": true 
            }
        ], 
        // "new-cap": [ // 构造函数首字母大写
        //     2, 
        //     { 
        //         "newIsCap": true, 
        //         "capIsNew": false 
        //     }
        // ],
        "new-cap": 0,
        "new-parens": 2, //在使用构造函数时候，函数调用的圆括号不能够省略 
        "no-array-constructor": 2, //禁止使用Array构造函数
        "no-class-assign": 2,  //禁止覆盖class命名，也就是说变量名不要和class名重名 
        "no-case-declarations": 2, // 禁止在case/default语句中使用lexical declarations，例如let, const, function and class .因为在case/default中的声明，在整个switch语句中都能够访问到，如果实在需要声明变量，可以加大括号。
        "no-cond-assign": 2, //在条件语句中不要使用赋值语句 
        "no-const-assign": 2,  //const申明的变量禁止修改
        // "no-control-regex": 2, //在正则表达式中禁止使用控制符（详见官网）
        "no-control-regex": 0, 
        "no-delete-var": 2, //禁止使用delete删除var申明的变量
        "no-dupe-args": 2, //函数参数禁止重名
        "no-dupe-class-members": 2 //class中的成员禁止重名
    }
};