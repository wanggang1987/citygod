import { forEach, objEqual, hasOneOf } from "@/libs/tools";
import config from "@/config";

export const TOKEN_KEY = "token";

export const setToken = (token) => {
    //cookies无法区分端口号，改为localStorage
    if (token) return localStorage.setItem(TOKEN_KEY, token);
    else return localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) return token;
    else return false;
};

export const hasChild = (item) => {
    return item.children && item.children.length !== 0;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute;
    let newList = [...list];
    if (newList.findIndex(item => item.name === name) >= 0) return newList;
    else newList.push({ name, path, meta });
    return newList;
};

export const getRouteTitleHandled = (route) => {
    let router = { ...route };
    let meta = { ...route.meta };
    let title = "";
    if (meta.title) {
        if (typeof meta.title === "function") {
            meta.__titleIsFunction__ = true;
            title = meta.title(router);
        } else title = meta.title;
    }
    meta.title = title;
    router.meta = meta;
    return router;
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2);
};

export const showTitle = (item, vm) => {
    let { title, __titleIsFunction__ } = item.meta;
    title = (item.meta && item.meta.title) || item.name;
    return title;
};

export const showShortName = (item, vm) => {
    let { title, __titleIsFunction__ } = item.meta;
    title = (item.meta && (item.meta.shortName || item.meta.title)) || item.name;
    return title;
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = [];
    forEach(list, item => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            let obj = {
                "icon": (item.meta && item.meta.icon) || "",
                "name": item.name,
                "meta": item.meta
            };
            if (hasChild(item) || (item.meta && item.meta.showAlways)) {
                obj.children = getMenuByRouter(item.children, access);
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href;
            if (showThisMenuEle(item, access) || hasChild(obj)) res.push(obj);
        }
    });
    return res;
};

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.title) {
        return access.indexOf(item.meta.title) !== -1 || item.meta.isAccess;
    } else return true;
};


/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = "home") => {
    let i = -1;
    let len = routers.length;
    let homeRoute = {};
    while (++i < len) {
        let item = routers[i];
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children, homeName);
            if (res.name) return res;
        } else {
            if (item.name === homeName) homeRoute = item;
        }
    }
    return homeRoute;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {};
    if (list.length === 2) {
        res = getHomeRoute(list);
    } else {
        const index = list.findIndex(item => routeEqual(item, route));
        if (index === list.length - 1) res = list[list.length - 2];
        else res = list[index + 1];
    }
    return res;
};






/**
 * @param {*} access 用户权限数组
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
    if (route.meta && route.meta.title){
        if (route.meta.isAccess) return true;
        return hasOneOf(access, route.meta.title);
    } else {
        const accessArr = ["error_401","error_401"];
        return hasOneOf(accessArr, route.name);
    } 
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = (list) => {
        return list.some(item => {
            if (hasChild(item)) {
                return routePermissionJudge(item.children);
            } else if (item.name === name) {
                return hasAccess(access, item);
            }
        });
    };

    return routePermissionJudge(routes);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
    let len = tagNavList.length;
    let res = false;
    doCustomTimes(len, (index) => {
        if (routeEqual(tagNavList[index], routeItem)) res = true;
    });
    return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
    let i = -1;
    while (++i < times) {
        callback(i);
    }
};

//获取区域级别
export const getAreaType = (data) => {
    let groupType = localStorage.getItem("groupType");
    let types = ["省级","市级","运管所"];
    let i = types.indexOf(groupType);
    types = types.slice(i);
    let index = data.length - 1;
    return types[index];
};

export const getAreaId = (areas, transportMngKey) => {
    let params = {};
    if (!areas.length) areas = [parseInt(localStorage.getItem("groupId"))];
    let areaType = getAreaType(areas);
    let key = areaType == "省级" ? "provinceId" : (areaType == "市级" ? "cityId" : (transportMngKey || "transportMngId"));
    params[key] = areas[areas.length - 1];
    return params;
};