<template>
    <auto-complete 
        v-model.trim="title" 
        :data="searchData" 
        @on-search="handleSearch" 
        style="width:200px;z-index:99999;" 
        class="autoComplete" 
        :placeholder="placeholder"
        :disabled="disabled"
    ></auto-complete>
</template>

<script>
import * as yd from "@/libs/yd";

export default {
    "name": "AutoComplete",
    "props": {
        "value": {
            "type": String,
            "default": ""
        },
        "placeholder": {
            "type": String,
            "default": "请输入..."
        },
        "disabled": {
            "type": Boolean,
            "default": false
        }
    },
    data () {
        return {
            "title": this.value,
            "id": 0,
            "searchData": [],
            "map": {},
            "timer": {}
        };
    },
    "watch": {
        title (val) {
            const self = this;
            self.$emit("input", val);
            self.id = self.map[val] ? self.map[val].id : (val.length ? -1 : 0);
        },
        id (val) {
            const self = this;
            self.$emit("on-change", val, self.title, self.map[self.title]);
        },
        value (val) {
            const self = this;
            self.title = val;
            self.searchData = [];
            self.map = {};
            self.handleSearch(val); // 如果两次传入的非空值相同则不会触发搜索，因此手动触发
        }
    },
    beforeDestroy () {
        const self = this;
        clearTimeout(self.timer);
    },
    "methods": {
        //on-search无法触发空字符串，on-change无法触发默认赋值，所以两个全部绑定查询操作，然后以延时器过滤
        handleSearch (value) {
            const self = this;
            clearTimeout(self.timer);
            self.searchData = []; // 清空联想数据
            if (value.length < 1) return;
            self.timer = setTimeout(() => {
                self.search(value);
            }, 200);
        },
        search (name) {
            const self = this;
            let params = self.queryParams(name);
            yd.ajax({
                ...self.options,
                "data": params,
                success (data) {
                    self.map = {};
                    let json = self.format(data);
                    if (json){
                        self.renderMap(json, name);
                    } else {
                        self.searchData = [];
                    }
                },
                error () {
                    self.searchData = [];
                }
            });
        },
        renderMap (json, name) {
            const self = this;
            let arr = [];
            json.forEach((item, i) => {
                arr.push(item.name);
                if (!self.map[item.name]) self.map[item.name] = item;
            });
            self.searchData = arr;
            let obj = self.map[name];
            self.id = obj ? obj.id : -1;
        }
    }
};
</script>