import { mapActions } from "vuex";
import store from "@/store";
import { local } from "@/libs/yd";
import logoLogin from "@/assets/images/loagingTitle1.png";
import browserMatch from "_c/browserMatch/browserMatch.vue";

export default {
    "name": "login",
    "components": {
        "browser-match": browserMatch
    },
    "data": function () {
        return {
            "user": localStorage.getItem("userName") && localStorage.getItem("userName") != "null" ? localStorage.getItem("userName") : "",
            "password": "",
            "yzm": "",
            "rememberUser": localStorage.getItem("userName") && localStorage.getItem("userName") != "null" ? true : false,
            "imgSrc": "",
            "errorInfo": "",
            "userInfo": "",
            "pwInfo": "",
            "yzmInfo": "",
            "timer": {},
            "backImgSrc": logoLogin,
            "loginClass": "",
            "imgClass": ""
        };
    },
    mounted () {
        // this.changeCaptcha();
    },
    "methods": {
        ...mapActions([
            "handleLogin",
            "getUserInfo"
        ]),
        "downloadBrowser": function(type){
            const self = this;
            console.log(type);
            if (type == 0){
                window.open("https://browser.360.cn/ee/");
            } else if (type == 1) {
                window.open("https://www.google.cn/chrome/");
            } else {
                window.open("https://www.firefox.com.cn/");
            }
        },
        "changeCaptcha": function (o) {
            const self = this;
            clearTimeout(self.timer);
            let url = local+"/authprovince/user/captcha";
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);//get请求，请求地址，是否异步
            xhr.responseType = "blob";
            xhr.onload = function(e) {
                localStorage.setItem("CaptchaCode",xhr.getResponseHeader("CaptchaCode"));
                if (this.status == 200) {
                    let blob = this.response;
                    let img = document.createElement("img");
                    img.onload = function(e) {
                        window.URL.revokeObjectURL(img.src);
                    };
                    self.imgSrc=window.URL.createObjectURL(blob);
                }
                //验证码120s失效自动刷新
                self.timer=setTimeout(function(){
                    self.changeCaptcha();
                },120000);
            };
            xhr.send();
        },
        "login": function () {
            const self = this;
            let params = {
                "userName": self.user,
                "pwd": self.password,
                "captcha": self.yzm,
                "module": "webprovince"
            };
            self.errorInfo="";
            self.userInfo="";
            self.pwInfo="";
            self.yzmInfo="";
            if (!params.userName) {
                self.errorInfo="用户名不为空";
                self.userInfo="用户名不为空";
                return;
            }
            if (!params.pwd) {
                self.pwInfo="密码不为空";
                self.errorInfo="密码不为空";
                return;
            }
            if (!/^\S{6,18}$/.test(params.pwd)) {
                self.pwInfo="密码6-18位";
                self.errorInfo="密码6-18位";
                return;
            }
            self.handleLogin(params).then(res => {
                if (self.rememberUser) localStorage.setItem("userName", params.userName);//如果勾选记住用户名则覆盖之前的数据，否则不做操作
                self.$router.push({
                    "name": self.$config.homeName
                });
            }).catch((xhr) => {
                // self.changeCaptcha();
                if (xhr.status == 401) {
                    if (xhr.data.message == "Authentication Failed: Illegal captcha.") {
                        self.errorInfo="您输入的验证码错误！";
                        self.yzmInfo="您输入的验证码错误！";
                    } else if (xhr.data.message == "Authentication Failed: Invalid username/password given.") {
                        self.errorInfo="您输入的账号或者密码有误！";
                        self.pwInfo="您输入的账号或者密码有误！";
                    } else if (xhr.data.message.indexOf("not found") > -1) {
                        self.errorInfo="您的账户" + params.userName + "不存在";
                        self.userInfo="您的账户" + params.userName + "不存在";
                    } else {
                        self.errorInfo="您的账户" + params.userName + "没有权限";
                        self.userInfo="您的账户" + params.userName + "没有权限";
                    }
                }
            });

        }
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        clearTimeout(this.timer);
        next();
    }
};