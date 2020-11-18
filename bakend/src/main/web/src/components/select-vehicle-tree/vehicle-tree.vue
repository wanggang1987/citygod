<template>
    <div class="treeWrapper" :class="{'active':searchkey.length}">
        <Tree :load-data="loadData" :userid="userid" :data="treeData" :render="renderContent" @on-check-change="checkChange" :show-checkbox="checkable" empty-text=""></Tree>
        <div class="tac prompt" v-show="(treeData.length==100)">没有找到您想要的结果？请尝试输入更多关键词！</div>
        <div class="emptyText tac" v-show="!treeData.length"><Icon type="md-alert" />没有符合该条件下的数据</div>
    </div>
</template>

<script>

import $ from "jquery";
import * as yd from "@/libs/yd";

export default {
    "name": "vehicleTree",
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
            "vehicleTreeList": [],
            "vehicleMap": {},
            "treeData": [],
            "groupMap": {},
            "groupTitleMap": {},
            "count": 0
        };
    },
    "watch": {
        "searchkey": function(newVal,oldVal){
            const self = this;
            if (newVal.length>=4||newVal.length==0){
                self.search();
            }
        },
        "type": function(newVal,oldVal){
            const self = this;
            self.search();
        },
        "defaults": function(newVal,oldVal){
            const self = this;
            if (self.checkable){
                self.initDefaults();
            } else {
                self.treeToggle(0);
                if (newVal.length){
                    let data=newVal[0];
                    let key=data.id||data;
                    let item=data.flag?self.groupTitleMap[key]:self.vehicleMap[key];
                    if (!item) return;
                    self.$set(item,"focus",true);
                    self.$emit("on-select-change",item);
                } else {
                    self.$emit("on-select-change",{});
                }
            }
        }
    },
    mounted () {
        const self = this;
        self.loadTree();
    },
    "methods": {
        "loadTree": function() {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/grouptree/getCount",
                "type": "GET",
                "dataType": "json",
                "data": {
                    "userId": self.userid
                },
                "success": function (json){
                    let len=Math.ceil(json/4000);
                    self.vehicleTreeList=[];
                    self.vehicleMap={};
                    self.groupMap={};
                    self.groupTitleMap={};
                    self.count=0;
                    for (let i=0;i<len;i++){
                        self.query(i,len);
                    }
                }
            });
        },
        "query": function(pageNo,length){
            const self = this;
            yd.ajax({
                "url": "../apiprovince/grouptree/getGroupTree",
                "type": "GET",
                "dataType": "json",
                "data": {
                    "userId": self.userid,
                    "pageNo": pageNo+1,
                    "pageSize": 4000
                },
                success (json) {
                    $.each(json,function(i,item){
                        if (!item.companyId||!item.companyName) return;
                        item.path=[item.companyId];
                        item.groupType="车辆";
                        item.id=item.vehicleId;
                        item.carLicense=item.license;
                        self.vehicleTreeList.push(item);
                        self.vehicleMap[item.vehicleId]=item;

                        //企业
                        if (!self.groupMap[item.companyId]) self.groupMap[item.companyId]={};

                        if (!self.groupTitleMap[item.companyId]) {self.groupTitleMap[item.companyId]={
                            "children": [],
                            "expand": false,
                            "groupType": "企业",
                            "id": item.companyId,
                            "loading": false,
                            "name": item.companyName,
                            "path": []
                        };}
                    });
                    self.count++;
                    if (self.count==length){
                        self.$emit("on-ready",{
                            "groupIdJson": self.groupMap,
                            "groupTitleJson": self.groupTitleMap,
                            "vehicleTreeList": self.vehicleTreeList
                        });
                        self.renderMap();
                    }

                }
            });
        },
        "renderMap": function() {
            const self = this;
            for (let i=0;i<self.vehicleTreeList.length;i++){
                let item=self.vehicleTreeList[i];
                let parents=item.path;
                self.$set(item,"focus",false);
                let title=item.carLicense+" "+item.color;
                self.$set(item,"title",title);
                self.eachParents(parents,item);
            }
            self.renderTreeData();
        },
        "eachParents": function(parents,item) {
            const self = this;
            self.eachParent(self.groupMap,parents,0,function(data){
                if (!data.vehicles) data.vehicles={};
                data.vehicles[item.id]=item;
            });
        },
        "renderTreeData": function() {
            const self = this;
            let arr=[];
            for (let i in self.groupMap){
                let item=self.groupTitleMap[i];
                //默认展开第一级
                if (item.groupType!="车辆"){
                    self.$set(item, "expand", true);
                    self.loadDatas(item);
                }
                arr.push(item);
            }
            self.treeData=arr;
        },
        "loadDatas": function (item){
            const self = this;
            self.loadData(item,function(json){
                self.$set(item, "children", json);
            });
        },
        "eachParent": function(data,parents,i,callback){
            const self = this;
            let argument=self.eachParent;
            let key=parents[i];
            if (parents.length-i>1){
                i++;
                argument(data[key],parents,i,callback);
            } else {
                callback(data[key],key);
            }
        },
        "loadData": function(item, callback) {
            const self = this;
            let parents=item.path;
            let arr=[];
            if (parents.length){
                self.eachParent(self.groupMap,parents,0,function(data){
                    arr=self.renderData(data,item);
                });
            } else {
                arr=self.renderData(self.groupMap,item);
            }
            callback(arr);
        },
        "renderData": function(data,item){
            const self = this;
            let groups=[];
            let i;
            for (i in data[item.id]){
                let obj=self.groupTitleMap[i];
                if (obj) groups.push(obj);
            }
            let vehicles=[];
            for (i in data[item.id].vehicles){
                vehicles.push(data[item.id].vehicles[i]);
            }
            self.sortBy(vehicles);
            return groups.concat(vehicles);
        },
        "checkChange": function(val,currentItem){
            const self = this;
            //更新子节点选中状态
            if (currentItem.groupType!="车辆") self.updateTreeDown(currentItem.id,currentItem.checked);
            //更新父节点选中状态
            if (currentItem.path.length) self.updateTreeUp(currentItem.path);
            let arr=[];
            let vehicles=[];
            let map={};
            $.each(val,function(i,item){
                if (item.groupType!="车辆"){
                    let flag=true;
                    $.each(item.path,function(n,key){
                        if (arr.indexOf(key)!=-1){
                            flag=false;
                            return false;
                        }
                    });
                    if (flag) arr.push(item.id);
                } else {
                    map[item.id]=true;
                    vehicles.push(item);
                }
            });
            $.each(self.vehicleTreeList,function(i,item){
                let flag=true;
                $.each(item.path,function(n,key){
                    if (arr.indexOf(key)!=-1){
                        flag=false;
                        return false;
                    }
                });
                if (item.checked) flag=false;
                if (!flag&&!map[item.id]) vehicles.push(item);
            });
            self.$emit("on-check-change",vehicles);
        },
        "updateTreeDown": function(currentId,currentStatus){
            const self = this;
            $.each(self.vehicleTreeList,function(i,item){
                if (item.path.indexOf(currentId)!=-1) self.$set(item,"checked",currentStatus);
            });
            $.each(self.groupTitleMap,function(i,item){
                if (item.path.indexOf(currentId)!=-1) self.$set(item,"checked",currentStatus);
            });
        },
        "initDefaults": function() {
            const self = this;
            self.cleanChecked();
            $.each(self.defaults,function(i,data){
                let key=data.id||data;
                //区分组织机构与车辆
                let item=data.flag?self.groupTitleMap[key]:self.vehicleMap[key];
                if (!item) return;
                self.$set(item,"checked",true);
                if (data.flag) self.updateTreeDown(item.id,item.checked);
                if (!item.path.length) return;
                self.updateTreeUp(item.path);
            });
            //将默认车辆信息回传
            let vehicles=[];
            $.each(self.vehicleTreeList,function(i,item){
                if (item.checked) vehicles.push(item);
            });
            self.$emit("on-check-change",vehicles);
        },
        "updateTreeUp": function(parents){
            const self = this;
            self.eachParent(self.groupMap,parents,0,function(data,id){
                let flag=true;//检验子节点是否存在未选中
                let indeterminate=false;//检验子节点是否存在选中
                $.each(data,function(d,sibId){
                    let sibling=self.groupTitleMap[d];
                    if (!sibling) return;
                    if (!sibling.checked){
                        flag=false;
                        // return false;
                    } else {
                        indeterminate=true;
                        //如果存在选中子节点并检测到未选中子节点，循环结束
                        if (!flag) return false;
                    }
                });
                //如果存在车辆子节点并且全选或半选状态未知
                if (data.vehicles&&(flag||!indeterminate)){
                    $.each(data.vehicles,function(d,sibId){
                        let sibling=self.vehicleMap[d];
                        if (!sibling.checked){
                            flag=false;
                            //如果存在未选中子节点并检测到选中子节点，循环结束
                            if (indeterminate) return false;
                        } else {
                            indeterminate=true;
                            //如果存在选中子节点并检测到未选中子节点，循环结束
                            if (!flag) return false;
                        }
                    });
                }

                let parent=self.groupTitleMap[id];
                if (flag){
                    //子节点全部选中
                    self.$set(parent,"checked",true);
                    self.$set(parent,"indeterminate",false);
                } else {
                    self.$set(parent,"checked",false);
                    //半选状态
                    self.$set(parent,"indeterminate",indeterminate);
                }
                if (!parent.path.length) return;
                self.updateTreeUp(parent.path);
            });
        },
        search () {
            const self = this;
            // self.cleanChecked(true);
            // self.treeToggle(0);
            // self.$emit("on-check-change",[]);
            // self.$emit("on-select-change",{});
            if (self.searchkey){
                let groupType=self.type?(self.type==1?"企业":"车队"):"车辆";
                let arr=[];
                if (self.type){
                    $.each(self.groupTitleMap,function(i,item){
                        self.$set(item,"expand",false);
                        if (item.groupType==groupType&&item.name.indexOf(self.searchkey)!=-1){
                            arr.push(item);
                        }
                    });
                } else {
                    let vehicles=self.vehicleTreeList;
                    for (let i=0;i<vehicles.length;i++){
                        let item=vehicles[i];
                        let regex=new RegExp(self.searchkey, "i");
                        if (item.carLicense.search(regex)!=-1&&arr.length<100){
                            //搜索结果最多展示100条
                            arr.push(item);
                        }
                    }
                    self.sortBy(arr);
                }
                self.treeData=self.type==1?self.removeDuplicateCompany(arr):arr;
            } else {
                $.each(self.groupTitleMap,function(i,item){
                    self.$set(item,"expand",false);
                });
                self.renderTreeData();
            }
        },
        "cleanChecked": function(flag){
            const self = this;
            $.each(self.groupTitleMap,function(i,item){
                self.$set(item,"checked",false);
                self.$set(item,"indeterminate",false);
                if (!flag) return;
                self.$set(item,"expand",false);
                self.$set(item,"indeterminate",false);
            });
            $.each(self.vehicleTreeList,function(i,item){
                self.$set(item,"checked",false);
            });
        },
        "renderContent": function (h, params) {
            const self = this;
            let root=params.root,
                node=params.node,
                data=params.data;
            if (data.groupType=="车辆"){
                let online = "";
                return h("span",
                    {
                        "class": "dib ivu-tree-title " + (data.focus ? " ivu-tree-title-selected": ""),
                        "on": {
                            "click": () => {
                                if (self.checkable) return;
                                self.$emit("on-select-change",!data.focus?data:{});
                                self.$set(data, "focus", !data.focus);
                                self.treeToggle(data);
                            }
                        }
                    },
                    [
                        h("span",{
                            "class": "whitespace dib",
                            "style": {
                                "max-width": "142px"
                            },
                            "attrs": {
                                "title": data.title
                            }
                        } ,data.title)
                    ]);
            } else {
                return h("span",
                    {
                        "class": "dib ivu-tree-title " + (data.focus ? " ivu-tree-title-selected": ""),
                        "on": {
                            "click": () => {
                                if (data.expand) {
                                    data.expand = false;
                                } else {
                                    data.expand = true;
                                    if (!data.children.length) {self.loadData(data,function(json){
                                        self.$set(data, "children", json);
                                    });}
                                }
                                if (self.selectgroup&&!self.checkable){
                                    self.$emit("on-select-change",!data.focus?data:{});
                                    self.$set(data, "focus", !data.focus);
                                    self.treeToggle(data);
                                }
                            }
                        }
                    },
                    [
                        h("span",{
                            "class": "whitespace dib",
                            "style": {
                                "max-width": "142px"
                            },
                            "attrs": {
                                "title": data.name
                            }
                        } ,data.name)
                    ]);
            }
        },
        "treeToggle": function(data){
            const self = this;
            let temp={
                "id": data.id||data,
                "groupType": data.groupType||"车辆"
            };
            $.each(self.vehicleTreeList,function(i,item){
                if (item.focus&&(item.id!=temp.id)||(item.groupType!=temp.groupType)) self.$set(item,"focus",false);
            });
            if (self.selectgroup){
                $.each(self.groupTitleMap,function(i,item){
                    if (item.focus&&(item.id!=temp.id)||(item.groupType!=temp.groupType)) self.$set(item,"focus",false);
                });
            }
        },
        "sortBy": function(vehicles){
            vehicles.sort(function(a,b){
                let val1 = a.vehicleStatus;
                let val2 = b.vehicleStatus;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    let str1=a.title;
                    let str2=b.title;
                    return str1.localeCompare(str2);
                }
            });
        },
        "getCheckedNodes": function() {
            const self = this;
            let nodes=[];
            $.each(self.groupTitleMap,function(i,item){
                if (item.checked) nodes.push(item);
            });
            $.each(self.vehicleTreeList,function(i,item){
                if (item.checked) nodes.push(item);
            });
            let map={};
            let arr=[];
            $.each(nodes,function(i,item){
                if (item.checked&&self.verifyInclude(item,map)){
                    map[item.id]=item;
                    arr.push(item);
                }
            });
            return arr;
        },
        "verifyInclude": function(data,map){
            const self = this;
            let flag=true;
            $.each(data.path,function(i,item){
                if (map[item]){
                    flag=false;
                    return false;
                }
            });
            return flag;
        },
        "removeDuplicateCompany": function(data){
            const self = this;
            let groups=[];
            $.each(data,function(i,item){
                let flag=true;
                let paths=item.path;
                let arr=[];
                $.each(groups,function(index,obj){
                    let path=obj.path;
                    if (paths.indexOf(obj.id)!=-1){
                        //祖企业已存在则忽略
                        flag=false;
                        return false;
                    } else if (path.indexOf(item.id)!=-1){
                        //后代企业已存在则去除后代企业
                        arr.push(index);
                    }
                });

                if (arr.length){
                    $.each(arr,function(j,key){
                        let index=key-j;
                        groups.splice(index,1);
                    });
                }
                if (flag) groups.push(item);
            });
            return groups;
        }
    }
};
</script>
