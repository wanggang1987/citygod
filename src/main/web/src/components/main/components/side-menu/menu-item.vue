<template>
    <li class="menuItem">
        <div class="menu-title" :style="groupStyle">
            <slot></slot>
        </div>
    </li>
</template>

<script>
export default {
    "name": "menuItem",
    "props": {
        "groupStyle": {
            "type": Object,
            default () {
                return {};
            }
        }
    }
};
</script>