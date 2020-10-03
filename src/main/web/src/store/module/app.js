import {
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getRouteTitleHandled,
    routeHasExist,
    getHomeRoute,
    getNextRoute,
    routeEqual
} from "@/libs/util";
import router from "@/router";
import routers from "@/router/routers";
import config from "@/config";
const { homeName } = config;

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route);
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route);
    });
    router.push(nextRoute);
};

export default {
    "state": {
        "tagNavList": [],
        "notCacheName": [],
        "contentHeight": window.innerHeight - 100
    },
    "getters": {
        "menuList": (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    },
    "mutations": {
        setTagNavList (state, list) {
            let tagList = [];
            if (list) {
                tagList = [...list];
            } else {
                tagList = getTagNavListFromLocalstorage() || [];
            }
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
            let homeTagIndex = tagList.findIndex(item => item.name === homeName);
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0];
                tagList.unshift(homeTag);
            }
            if (!tagList[0]) tagList.push(getHomeRoute(routers,homeName));
            state.tagNavList = tagList;
        
            setTagNavListInLocalstorage([...tagList]);
        },
        closeTag (state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route));
            route = tag[0] ? tag[0] : null;
            if (!route) return;
            closePage(state, route);
        },
        addTag (state, { route, type = "unshift" }) {
            let router = getRouteTitleHandled(route);
            let index = state.tagNavList.findIndex(item => item.name === router.name);
            let oldRoute = state.tagNavList[index];
            if (!oldRoute) {
                if (type === "push"){
                    state.tagNavList.push(router);
                } else {
                    if (router.name === homeName) state.tagNavList.unshift(router);
                    else state.tagNavList.splice(1, 0, router);
                }
                setTagNavListInLocalstorage([...state.tagNavList]);
            } else if (!routeEqual(oldRoute, router)) {
                state.notCacheName = [router.name];
                state.tagNavList.splice(index, 1, router);
                Vue.nextTick(() => {
                    state.notCacheName = [];
                });
            }
        },
        closePage (state, route) {
            let res = state.tagNavList.filter(item => !routeEqual(route, item));
            this.commit("setTagNavList", res);
        }
    }
};