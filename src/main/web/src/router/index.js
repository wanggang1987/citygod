import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
// import iView from "view-design";
import { setToken, getToken, canTurnTo } from "@/libs/util";
import config from "@/config";
const { homeName } = config;

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) { 
    return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
    routes,
    "mode": "history"
});

const LOGIN_PAGE_NAME = "login";

const queryParentName = (matched) => {
    const index = matched.length - 2;
    return matched[index].name;
};

const turnTo = (to, access, next) => {
    let name = to.name;
    if (to.meta && to.meta.relyAccess) name = queryParentName(to.matched);
    if (canTurnTo(name, access, routes)) next(); // 有权限，可访问
    else next({ "replace": true, "name": "error_401" });// 无权限，重定向到401页面
};

router.beforeEach((to, from, next) => {
    // iView.LoadingBar.start();
    const token = getToken();
    if (!token && to.name !== LOGIN_PAGE_NAME && to.name !== "bigScreen") {
    // 未登录且要跳转的页面不是登录页
        next({
            "name": LOGIN_PAGE_NAME // 跳转到登录页
        });
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
        next(); // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
        next({
            "name": homeName // 跳转到homeName页
        });
    } else {
        turnTo(to, store.state.user.access, next);
    }
});


router.afterEach(to => {
    // iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


export default router;