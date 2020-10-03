<template>
    <div class="contentWrapper">
        <!-- 顶部导航 start -->
        <div class="nav clearfix">
            <Logo></Logo>
            <user @change-password="showPasswordModal = true"></user>
        </div>
        <!-- 顶部导航 end -->
    
        <!-- 侧导航 start -->
        <SideMenu
            ref="sideMenu" :active-name="$route.name" @on-select="turnToPage"
            :menu-list="menuList"></SideMenu>
        <!-- 侧导航 end -->
        <div class="tag-nav-wrapper">
            <tags-nav
                :value="$route" @input="handleClick" :list="tagNavList"
                @on-close="handleCloseTag"/>
        </div>
        <keep-alive :include="cacheList" :exclude="notCacheName">
            <router-view :key="$route.path"/>
        </keep-alive>

        <!-- 修改密码 start -->
        <ChangePassword v-model="showPasswordModal"></ChangePassword>
        <!-- 修改密码 start -->
    </div>
</template>

<script>
import SideMenu from "./components/side-menu";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import Logo from "./components/logo";
import ChangePassword from "./components/changePassword";
import { mapMutations } from "vuex";
import { getNewTagList, routeEqual } from "@/libs/util";
import routers from "@/router/routers";
import * as yd from "@/libs/yd";

export default {
    "name": "Main",
    "components": {
        SideMenu,
        TagsNav,
        User,
        ChangePassword,
        Logo
    },
    data () {
        return {
            "showPasswordModal": false
        };
    },
    "computed": {
        tagNavList () {
            return this.$store.state.app.tagNavList;
        },
        menuList () {
            return this.$store.getters.menuList;
        },
        cacheList () {
            const list = ["ParentView", ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []];
            return list;
        },
        notCacheName () {
            return this.$store.state.app.notCacheName;
        }
    },
    "watch": {
        "$route" (newRoute) {
            const { name, query, params, meta } = newRoute;
            this.addTag({
                "route": { name, query, params, meta },
                "type": "push"
            });
            // this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
        }
    },
    "methods": {
        ...mapMutations([
            "setTagNavList",
            "addTag",
            "closeTag"
        ]),
        turnToPage (route) {
            let { name, params, query } = {};
            if (typeof route === "string"){
                name = route;
            } else {
                name = route.name;
                params = route.params;
                query = route.query;
            }
            this.$router.push({
                name,
                params,
                query
            });
        },
        handleCloseTag (res, type, route) {
            if (type !== "others") {
                if (type === "all") {
                    this.turnToPage(this.$config.homeName);
                } else {
                    if (routeEqual(this.$route, route)) {
                        this.closeTag(route);
                    }
                }
            }
            this.setTagNavList(res);
        },
        handleClick (item) {
            this.turnToPage(item);
        }
    },
    mounted () {
        /**
         * @description 初始化设置标签导航
         */
        this.setTagNavList();

        const { name, params, query, meta } = this.$route;
        this.addTag({
            "route": { name, params, query, meta }
        });
        // 如果当前打开页面不在标签栏中，跳到homeName页
        if (!this.tagNavList.find(item => item.name === this.$route.name)) {
            this.$router.push({
                "name": this.$config.homeName
            });
        }
    },
    destroyed() {
        this.$Notice.destroy();
        clearTimeout(this.timer);
    }
};

</script>
