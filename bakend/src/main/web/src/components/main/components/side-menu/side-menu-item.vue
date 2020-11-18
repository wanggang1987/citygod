<template>
    <ul>
        <template v-for="item in menuList">
            <template v-if="item.children && item.children.length">
                <Submenu v-if="showChildren(item)" :key="`menu-${item.name}`" :group-style="groupStyle">
                    <i v-if="item.icon" class="iconfont fs18" :class="item.icon"></i>
                    <svg v-else-if="item.svg" aria-hidden="true">
                        <use v-bind:xlink:href="'#'+item.svg"></use>
                    </svg>
                    {{ showTitle(item) }}
                    <side-menu-item
                        slot="menuItem" class="menu" :menu-list="item.children"
                        :active-name="activeName" :opened-names="openedNames" :parent-submenu-num="parentSubmenuNum+1" @on-select="handleSelect"></side-menu-item>
                </Submenu>
                <menuItem
                    v-else @click.native.stop="handleSelect(item.children[0].name)" :class="{'active':openedNames.indexOf(item.children[0].name)!=-1}" :key="`menu-${item.name}`"
                    :group-style="groupStyle">
                    <i v-if="item.children[0].icon" class="iconfont fs18" :class="item.children[0].icon"></i>
                    <svg v-else-if="item.children[0].svg" aria-hidden="true" >
                        <use v-bind:xlink:href="'#'+item.children[0].svg"></use>
                    </svg>
                    {{ showTitle(item.children[0]) }}
                </menuItem>
            </template>
            <template v-else>
                <menuItem @click.native.stop="handleSelect(item.name)" :class="{'active':openedNames.indexOf(item.name)!=-1}" :key="`menu-${item.name}`" :group-style="groupStyle">
                    <i v-if="item.icon" class="iconfont fs18" :class="item.icon"></i>
                    <svg v-else-if="item.svg" aria-hidden="true" >
                        <use v-bind:xlink:href="'#'+item.svg"></use>
                    </svg>
                    {{ showTitle(item) }}
                </menuItem>
            </template>
        </template>
    </ul>
</template>

<script>
import mixin from "./mixin";
import menuItem from "./menu-item.vue";
import Submenu from "./Submenu.vue";
export default {
    "name": "SideMenuItem",
    "components": {
        menuItem,
        Submenu
    },
    "mixins": [ mixin ],
    "props": {
        "menuList": {
            "type": Array,
            default () {
                return [];
            }
        },
        "openedNames": {
            "type": Array,
            default () {
                return [];
            }
        },
        "parentSubmenuNum": {
            "type": Number,
            "default": 1
        },
        "activeName": {
            "type": String,
            "default": ""
        }
    },
    "computed": {
        groupStyle () {
            return this.parentSubmenuNum ? {
                "paddingLeft": 16 + (this.parentSubmenuNum - 1) * 32 + "px"
            } : {};
        }
    },
    data () {
        return {
        };
    },
    "methods": {
        handleSelect (item) {
            this.$emit("on-select", item);
        }
    }
};
</script>