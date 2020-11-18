<template>
<div class="contents grey_b">
    <div class="content" style="padding:0 0 12px 0;" v-cloak>
        <ul class="menuTab">
            <router-link v-for="(item, index) in tabs" :to="item.url" tag="li" class="pr" :key="index">
                <a>{{ item.title }}</a>
            </router-link>
        </ul>
        <keep-alive :exclude="notCacheName">
            <router-view></router-view>
        </keep-alive>
    </div>
</div>
</template>

<script>
export default {
    "name": "tabs",
    data () {
        return {
            "tabs": [
                {
                    "title": "地区",
                    "name": "area",
                    "url": "/area"
                }, {
                    "title": "企业",
                    "name": "enterprise",
                    "url": "/enterprise"
                }, {
                    "title": "车辆",
                    "name": "vehicle",
                    "url": "/vehicle"
                }
            ],
            "notCacheName": []
        };
    },
    created () {
        this.loadParams();
    },
    "methods": {
        loadParams () {
            const self = this;
            const $route = self.$root.$route;
            const param = $route.query;
            const baseTab = self.tabs[0];
            if (param.type && baseTab) {
                self.$router.push({
                    "name": param.type || baseTab.name,
                    "params": param
                });
            }
        }
    }
};
</script>