<template>
<Tooltip transfer :disabled="!showTooltip" :max-width="300" class="ivu-table-cell-tooltip">
    <span ref="content" @mouseenter="handleTooltipIn" @mouseleave="handleTooltipOut" class="ivu-table-cell-tooltip-content">
        <slot>{{ content }}</slot>
    </span>
    <div slot="content" style="word-wrap:break-word;word-break:break-all;">{{content}}</div>
</Tooltip>
</template>

<script>
export default {
    "name": "tableTip",
    "props": {
        "content": {
            "type": [String, Number],
            "default": ""
        }
    },
    data () {
        return {
            "showTooltip": false // 鼠标滑过overflow文本时，再检查是否需要显示
        };
    },
    "methods": {
        "handleTooltipIn": function() {
            let $content = this.$refs.content;
            this.showTooltip = $content.scrollWidth > $content.offsetWidth;
        },
        "handleTooltipOut": function() {
            this.showTooltip = false;
        }
    }
};
</script>
