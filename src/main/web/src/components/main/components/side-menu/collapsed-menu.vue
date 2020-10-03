<template>
    <Dropdown
        ref="dropdown" @on-click="handleClick" transfer
        transfer-class-name="menu-transfer" :placement="placement">
        <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)">
            <i v-if="parentItem.icon" class="iconfont db" :class="parentItem.icon"></i>
            <svg class="db" v-else-if="parentItem.svg" aria-hidden="true" >
                <use v-bind:xlink:href="'#'+parentItem.svg"></use>
            </svg>
            {{ showShortName(parentItem) }}
        </a>
        <DropdownMenu ref="dropdown" slot="list">
            <template v-for="child in children">
                <DropdownItem :key="`drop-${child.name}`" :name="child.name" :class="{'active':openedNames.indexOf(child.name)!=-1}">
                    <span class="menu-title">{{ showTitle(child) }}</span>
                </DropdownItem>
            </template>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
import mixin from "./mixin";
// import itemMixin from './item-mixin'
// import { findNodeUpperByClasses } from '@/libs/util'

export default {
    "name": "CollapsedMenu",
    "mixins": [ mixin ],
    "props": {
        "hideTitle": {
            "type": Boolean,
            "default": false
        },
        "parentItem": {
            "type": Object,
            "default": () => {}
        },
        "openedNames": {
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
    "computed": {
        parentName () {
            return this.parentItem.name;
        },
        children () {
            return this.parentItem.children;
        }
    },
    data () {
        return {
            "placement": "right-end"
        };
    },
    "methods": {
        handleClick (name) {
            this.$emit("on-click", name);
        },
        handleMousemove (event, children) {
            const { pageY } = event;
            const height = children.length * 38;
            const isOverflow = pageY + height < window.innerHeight;
            this.placement = isOverflow ? "right-start" : "right-end";
        }
    },
    mounted () {
    // let dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer'])
    // if (dropdown) dropdown.style.overflow = 'visible'
    }
};
</script>
