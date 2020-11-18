<template>
    <div class="treeSelector">
        <div class="searchWarp">
            <input v-model="searchkey" autocomplete="off" :placeholder="placeholder" class="ivu-input" type="text" />
        </div>
        <ul class="tabWap clearfix tac" v-show="searchKey.length">
            <li class="fl" v-for="item in list" @click="clickTab(item)" :class="{'active':searchType==item.value,'disabled':(item.value==2&&!allowteam)}" :style="{'width':width}" :key="item.value">{{ item.label }}</li>
        </ul>
        <div style="color:#5a5a5a;font-size: 12px;line-height: 30px;border-bottom:1px dashed #E9E9E9">注：
            <i class="iconfont icon_video fs10" style="color:#00A854;margin-right: 1px;margin-bottom: 1px;margin-left: -8px"></i><label style="color:#00A854">表示可播放</label>
            <i class="iconfont icon_video fs10" style="color:#999999;margin-right: 1px;margin-bottom: 1px;margin-left: 4px"></i>表示不可播放
            <Poptip trigger="hover" popper-class="treePop" content="content" placement="bottom-end" offset="30">
                <span style="color: #2059EF;margin-left: 7px;cursor:pointer">更多</span>
                <div class="api" slot="content">
                    <span style="display: block;font-weight: bold">视频可播放&抓拍的条件</span>
                    <span style="display: block">(1)车辆在线</span>
                    <span style="display: block">(2)有sim卡</span>
                    <span style="display: block">(3)有视频通道信息</span>
                </div>

            </Poptip>
        </div>
        <vehicle-tree :userid="userid" :checkable="checkable" :type="searchType" :searchkey="searchKey" :defaults="defaults" :selectgroup="selectgroup" @on-check-change="checkChange" @on-select-change="selectChange" @on-ready="onReady" ref="children"></vehicle-tree>
    </div>
</template>

<script>

import $ from "jquery";
import * as yd from "@/libs/yd";
import vehicleTree from "./vehicle-tree";

export default {
    "name": "vehicleTreeSelect",
    "components": {
        "vehicle-tree": vehicleTree
    },
    "props": {
        "type": {//树类型 0:车辆、1:组织架构、2:司机
            "type": Number,
            "default": 0
        },
        "checkable": {//是否显示多选框
            "type": Boolean,
            "default": false
        },
        "defaults": {//默认勾选值，id数组
            "type": Array,
            default () {
                return [];
            }
        },
        "selectgroup": {//车辆树是否支持组织机构or车辆单选
            "type": Boolean,
            "default": false
        },
        "allowteam": {//组织机构树是否允许展示车队
            "type": Boolean,
            "default": true
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
            "searchkey": "",
            "searchKey": "",
            "width": "100%",
            "timer": "",
            "placeholder": "请输入车牌号、企业名",
            "content": ""
        };
    },
    "watch": {
        "defaults": function(newVal,oldVal){
            const self = this;
            if (!newVal.length){
                self.searchkey="";
                self.searchType=self.list[0].value;
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
                self.list=[

                ];
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
