<template>
    <li class="menuItem">
        <div class="menu-submenu-title" :style="groupStyle" @click.stop="handleClick">
            <slot></slot>
            <i class="ivu-icon fr" :class="!opened?'ivu-icon-ios-arrow-down':'ivu-icon-ios-arrow-up'" style="line-height:50px;"></i> 
        </div>
        <div v-show="opened">
            <slot name="menuItem"></slot>
        </div>
    </li>
</template>

<script>
export default {
    "name": "Submenu",
    "props": {
        "groupStyle": {
            "type": Object,
            default () {
                return {};
            }
        }
    },
    data () {
        return {
            "opened": false
        };
    },
    "methods": {
        handleClick (item) {
            const opened = this.opened;
            this.opened=!opened;
        }
    }

}; 
</script>