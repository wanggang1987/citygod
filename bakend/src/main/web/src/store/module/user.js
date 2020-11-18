import { setToken, getToken } from "@/libs/util";
import { request } from "@/libs/yd";
import config from "@/config";

export default {
    "state": {
        "userName": localStorage.getItem("_user") && localStorage.getItem("_user") != "null" ? localStorage.getItem("_user") : "",
        "userId": localStorage.getItem("_id") && localStorage.getItem("_id") != "null" ? parseInt(localStorage.getItem("_id")) : "",
        "hasGetInfo": false,
        "token": getToken(),
        "access": localStorage.getItem("access") && localStorage.getItem("access") != "null" ? JSON.parse(localStorage.getItem("access")) : ""
    },
    "mutations": {
        setUserId (state, id) {
            state.userId = id;
            localStorage.setItem("_id", id);
        },
        setUserName (state, name) {
            state.userName = name;
            localStorage.setItem("_user", name);
        },
        setToken (state, token) {
            state.token = token;
            setToken(token);
        },
        setAccess (state, access) {
            state.access = access;
            localStorage.setItem("access", JSON.stringify(access));
        },
        setHasGetInfo (state, status) {
            state.hasGetInfo = status;
        }
    },
    "getters": {

    },
    "actions": {
        // 登录
        handleLogin ({ commit }, params) {
            return new Promise((resolve, reject) => {
                request({
                    "url": "/authprovince/user/login",
                    "method": "post",
                    "data": params,
                    "headers": { 
                        "CaptchaCode": localStorage.getItem("CaptchaCode") // 请求头                                              
                    }
                }).then(res => {
                    if (res.status == 200) {
                        const json = res.data;
                        commit("setToken", res.headers.authorization);
                        commit("setUserName", json.username);
                        commit("setUserId", json.id);
                        let group = json.group;
                        const groupType = group.type;

                        let application = json.application;
                        if (groupType !== "省级") {
                            // 非省级账号不展示省级报表
                            application = application.filter((item) => {
                                return item != "联网联控考核表(省)";
                            });
                        }

                        // jsyd添加角色管理权限
                        application = application.concat(config.isAccess || [], json.username == "admin" ? ["大屏"] : []); //额外页面权限


                        commit("setAccess", application);

                        localStorage.setItem("roles", json.roles);

                        
                        localStorage.setItem("groupType", groupType);
                        localStorage.setItem("groupId", group.id);

                        // 部标联网联控融合使用
                        localStorage.setItem("userId", json.userId);

                        localStorage.removeItem("tagNaveList"); // 登录之后清空标签记录
                    }
                    resolve(res);
                }).catch(err => {
                    reject(err.response);
                });
            });
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            return new Promise((resolve, reject) => {
            // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                commit("setToken", "");
                resolve();
            });
        }
    }
};