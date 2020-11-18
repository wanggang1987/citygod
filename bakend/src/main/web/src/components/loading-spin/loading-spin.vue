<template>
    <Spin fix v-show="value">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div class="loading">正在加载数据</div>
    </Spin>
</template>

<script>
export default {
    "name": "loadingSpin",
    "props": {
        "value": {
            "type": Boolean,
            "default": false
        }
    }
};
</script>