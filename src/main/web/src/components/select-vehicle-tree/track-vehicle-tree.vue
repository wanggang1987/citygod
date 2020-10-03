<template>
    <div class="treeSelector">
        <div class="searchWarp">
            <input v-model="searchkey" autocomplete="off" :placeholder="placeholder" class="ivu-input" type="text" />
        </div>
        <ul class="tabWap clearfix tac" v-show="searchKey.length" v-if="list.length">
            <li class="fl" v-for="item in list" @click="clickTab(item)" :class="{'active':searchType==item.value,'disabled':(item.value==2&&!allowteam)}" :style="{'width':width}" :key="item.value">{{item.label}}</li>
        </ul>
        <vehicle-tree v-if="type==0 || type==3" :userid="userid" :checkable="checkable" :type="searchType" :searchkey="searchKey" :defaults="defaults" :selectgroup="selectgroup" @on-check-change="checkChange" @on-select-change="selectChange" @on-ready="onReady" ref="children"></vehicle-tree>
    </div>
</template>

<script>

import $ from "jquery";
import * as yd from "@/libs/yd";
import vehicleTree from "./vehicle-tree.vue";

export default {
    "name": "trackVehicleTree",
    "components": {
        "vehicle-tree": vehicleTree
    },
    "props": {
        "searchkey": {//搜索关键字
            "type": String,
            "default": ""
        },
        "type": {//搜索纬度 0:车辆 1:企业，2车队
            "type": Number,
            "default": 0
        },
        "defaults": {//默认勾选值，id or {id:0,flag:true}数组
            "type": Array,
            default () {
                return [];
            }
        },
        "checkable": {//是否显示多选框,多选开启关闭单选
            "type": Boolean,
            "default": false
        },
        "selectgroup": {//是否支持组织机构单选
            "type": Boolean,
            "default": false
        },
        "userid": {
            "type": Number,
            "default": null
        }
    },
    data () {
        return {
            "list": [],
            "searchType": 0,
            "searchKey": "",
            "width": "100%",
            "timer": "",
            "placeholder": "请输入车牌号、企业名"
        };
    },
    "watch": {
        "defaults": function(newVal,oldVal){
            const self = this;
            if (!newVal.length){
                self.searchkey="";
                if (self.list.length) self.searchType=self.list[0].value;
            }
        },
        "searchkey": function(newVal,oldVal){
            const self = this;
            clearTimeout(self.timer);
            self.timer=setTimeout(() => {
                self.searchKey=$.trim(self.searchkey);
                $(".treeWrapper").scrollTop(0);
            },200);
        },
        "searchType": function(newVal,oldVal){
            const self = this;
            $(".treeWrapper").scrollTop(0);
        }
    },
    "beforeDestroy": function() {
        const self = this;
        clearTimeout(self.timer);
    },
    created () {
        const self = this;
        switch (self.type){
            case 0:
                self.list=[
                    {
                        "label": "车辆",
                        "value": 0
                    },{
                        "label": "企业",
                        "value": 1
                    }
                ];
                self.searchType=0;
                self.width="50%";
                self.placeholder="请输入车牌号、企业名";
                break;
            case 1:
                self.list=[
                    {
                        "label": "企业",
                        "value": 1
                    },{
                        "label": "车队",
                        "value": 2
                    }
                ];
                self.width="50%";
                self.searchType=1;
                if (self.allowteam==false){
                    self.placeholder="请输入企业关键字";
                } else {
                    self.placeholder="请输入企业/车队名";
                }
                break;
            case 2:
                self.list=[
                    {
                        "label": "司机",
                        "value": 0
                    },{
                        "label": "企业",
                        "value": 1
                    },{
                        "label": "车队",
                        "value": 2
                    }
                ];
                self.searchType=0;
                self.width="33.33333333%";
                self.placeholder="请输入司机名、企业/车队名";
                break;
            case 3:
                self.list=[];
                self.width="50%";
                self.searchType=0;
                self.placeholder="请输入车牌号";
                break;
            default:
                break;
        }
    },
    "methods": {
        "checkChange": function(data){
            const self = this;
            self.$emit("on-check-change",data);
        },
        "onReady": function(json){
            const self = this;
            self.$emit("on-ready",json);
        },
        "selectChange": function(data){
            const self = this;
            self.$emit("on-select-change",data);
        },
        "getCheckedNodes": function() {
            const self = this;
            return self.$refs.children.getCheckedNodes();
        },
        "clickTab": function(item){
            const self = this;
            if (!self.allowteam&&item.value==2) return;
            self.searchType=item.value;
        },
        "refresh": function() {
            const self = this;
            self.searchkey="";
            self.$refs.children.loadTree();
        }

    }
};
</script>
