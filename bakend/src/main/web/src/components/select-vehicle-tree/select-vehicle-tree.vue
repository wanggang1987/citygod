<!--轨迹回放树-->
<template>
    <Poptip placement="bottom" v-model="visible" class="treeSelectWap dib pr" transfer style="width:100%">
        <div class="br titlebar">
            <span v-show="!title" style="color:#aaa">{{placeholder}}</span>
            <div class="simulationBtn dib pr" v-show="title">
                <span class="whitespace dib">{{title}}</span>
                <i-button size="small" type="text" @click="init"><Icon type="md-close" /></i-button>
            </div>
            <i class="ivu-icon ivu-icon-ios-arrow-down ivu-input-icon ivu-input-icon-normal"></i>
        </div>
        <div class="treeSelectContent" slot="content" style="width:216px;height:300px;">
            <tree-selector :type="type" :userid="userid" :defaults="defaultsData" :checkable="checkable" :selectgroup="selectgroup" :allowteam="allowteam" @on-check-change="checkChange" @on-select-change="selectChange" @on-ready="onReady" ref="tree"></tree-selector>
        </div>
    </Poptip>
</template>

<script>

import $ from "jquery";
import * as yd from "@/libs/yd";
import vehicleTreeSelect from "./track-vehicle-tree";
export default {
    "name": "selectVehicleTree",
    "components": {
        "tree-selector": vehicleTreeSelect
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
    "data": function () {
        return {
            "visible": false,
            "title": "",
            "placeholder": "",
            "defaultsData": []
        };
    },
    created () {
        const self = this;
        // self.placeholder='请选择'+(self.type?(self.type==1?(self.allowteam?'组织机构':'企业'):''):'车辆');
        self.placeholder="请选择"+(self.type==3?"车辆":"");
    },
    "watch": {
        "defaults": function(newVal,oldVal){
            const self = this;
            self.defaultsData=newVal;
        }
    },
    "methods": {
        "init": function () {
            const self = this;
            self.title="";
            self.defaultsData=[];
        },
        "checkChange": function(data){
            const self = this;
            if (!data.length){
                self.title="";
            } else if (data.length>1){
                self.title="已勾选"+data.length+(self.type?(self.type==1?"个组织机构":"个司机"):"辆车");
            } else {
                self.title=(self.type?(self.type==1?data[0].name:data[0].driverName):(data[0].title||data[0].name))||"";
            }
            self.$emit("on-check-change",data);
        },
        "selectChange": function (data) {
            const self = this;
            // self.title=(self.type?(self.type==1?data.name:(data.driverName||data.name)):(data.title||data.name))||"";
            self.title=self.type==3?data.carLicense?(data.carLicense +" " +data.color):"": "";
            self.$emit("on-select-change",data);
        },
        "onReady": function(json){
            const self = this;
            self.$emit("on-ready",json);
        },
        "getCheckedNodes": function() {
            const self = this;
            return self.$refs.tree.getCheckedNodes();
        },
        "refresh": function() {
            const self = this;
            self.$refs.tree.refresh();
        }

    }
};
</script>
