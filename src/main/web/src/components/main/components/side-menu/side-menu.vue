<template>
    <div class="side-menu" :class="{'off':collapsed}">
        <div class="side-menu-wrapper" ref="sideMenuBar">
            <side-menu-item
                class="menu-submenu" v-show="!collapsed" :menu-list="menuList"
                :active-name="activeName" :opened-names="openedNames" @on-select="handleSelect"></side-menu-item>
            <div class="menu-collapsed" v-show="collapsed">
                <template v-for="item in menuList">
                    <collapsed-menu
                        v-if="item.children && (item.children.length > 1 || showChildren(item))" @on-click="handleSelect" :parent-item="item"
                        :active-name="activeName" :opened-names="openedNames" :key="`drop-menu-${item.name}`"></collapsed-menu>
                    <Tooltip
                        transfer v-else :content="showTitle(item.children && item.children[0] ? item.children[0] : item)"
                        placement="right" :key="`drop-menu-${item.name}`">
                        <a @click="handleSelect(item.name)" class="drop-menu-a">
                            <i v-if="(item.children && item.children[0] ? item.children[0] : item).icon" class="iconfont db" :class="(item.children && item.children[0] ? item.children[0] : item).icon"></i>
                            <svg class="db" v-else-if="(item.children && item.children[0] ? item.children[0] : item).svg" aria-hidden="true" >
                                <use v-bind:xlink:href="'#'+(item.children && item.children[0] ? item.children[0] : item).svg"></use>
                            </svg>
                            {{ showShortName(item.children && item.children[0] ? item.children[0] : item) }}
                        </a>
                    </Tooltip>
                </template>
            </div>
        </div>
        <div @click="collapsed=!collapsed" class="sliderBtn" :class="!collapsed?['tar']:['tac']">
            <i class="iconfont fs24" :class="!collapsed?'icon_slid_close':'icon_slid_open'"></i>
        </div>
    </div>
</template>
<script>
import CollapsedMenu from "./collapsed-menu.vue";
import SideMenuItem from "./side-menu-item.vue";
import mixin from "./mixin";

export default {
    "name": "SideMenu",
    "mixins": [ mixin ],
    "components": {
        SideMenuItem,
        CollapsedMenu
    },
    "props": {
        "menuList": {
            "type": Array,
            default () {
                return [];
            }
        },
        "activeName": {
            "type": String,
            "default": ""
        }
    },
    data () {
        return {
            "openedNames": [],
            "collapsed": false
        };
    },
    "watch": {
        activeName (name) {
            this.openedNames = this.getOpenedNamesByActiveName(name);
        }
    },
    "methods": {
        handleSelect (item) {
            this.$emit("on-select", item);
        },
        getOpenedNamesByActiveName (name) {
            return this.$route.matched.map(item => item.name);
        }
    },
    mounted () {
        this.openedNames = this.getOpenedNamesByActiveName(name);
    }
};
</script>
