import * as yd from "@/libs/yd";
import config from "@/config";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import {getAreaId} from "@/libs/util";
import tableBase from "_m/tableBase";
import documentTypeTreeSelect from "_c/treeSelect/documentType";
export default {
    "name": "routesManagement",
    "mixins": [tableBase],
    "components": {
        "loading-spining": loadingSpin,
        documentTypeTreeSelect
    },
    data() {
        const self = this;
        return {
            "zoneName": "",
            "documentType": [],
            "status": "-1",
            "spinShow": false,
            "columns": [
                {
                    "title": "序号",
                    "width": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                }, {
                    "title": "操作",
                    "key": "action",
                    "minWidth": 120,
                    "render": (h, params) => {
                        const edit = h("a", {
                            "class": "pr10",
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.editRoute(params.row.zoneId);
                                }
                            }
                        }, "编辑");

                        const view = h("a", {
                            "class": "pr10",
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.showDetail(params.row);
                                }
                            }
                        }, "查看");

                        const del = h("a", {
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.deleteRoute(params.row.zoneId);
                                }
                            }
                        }, "删除");

                        return  h("div", self.isAdmin ? [edit, view, del] : [view]);
                    }
                },

                {
                    "title": "行驶方向",
                    "key": "zoneName",
                    "minWidth": 300,
                    render (h,params){
                        return (params.row.fromName||"")+"——"+(params.row.toName||"");
                    }
                },{
                    "title": "行驶路线名称",
                    "key": "zoneName",
                    "minWidth": 200,
                    "tooltip": true
                }, {
                    "title": "单证类型",
                    "key": "documentType",
                    "minWidth": 105,
                    "render": (h, params) => {
                        const types = params.row.documentType.split(",");
                        const documentType = types.map((item) => {
                            return SubConfig.documentType[item] || "--";
                        });
                        return self.tooltipRender(h, documentType.join("，"));
                    }
                }, {
                    "title": "规定时间",
                    "key": "setTime",
                    "minWidth": 150,
                    "render": (h, params) => {
                        const content = yd.secToDay(params.row.setTime * 60);
                        return self.tooltipRender(h, content);
                    }
                }, {
                    "title": "状态",
                    "key": "zoneStatus",
                    "minWidth": 60,
                    "render": (h, params) => {
                        return self.tooltipRender(h, SubConfig.fenceStatus[params.row.zoneStatus]);
                    }
                }
            ],
            "tableData": []
        };
    },
    "computed": {
        isAdmin () {
            return this.$store.state.user.userName === "admin";
        }
    },
    mounted() {
        const self = this;
        self.search();
    },
    "methods": {
        search() {
            let self=this;
            self.pageNo=1;
            self.loadTable();
        },
        loadTable () {
            let self=this;
            yd.ajax({
                "url": "/apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "dataType": "JSON",
                "data": {
                    "zoneType": 0,
                    "zoneName": self.zoneName,
                    "documentType": self.documentType.join(","),
                    "zoneStatus": self.status==-1?null:self.status,
                    "pageNo": self.pageNo,
                    "pageSize": self.pageSize
                },
                success(data){
                    self.tableData=data.list;
                    self.total=data.totalCount;
                },error(){
                    self.tableData=[];
                    self.total=0;
                }
            });
        },
        addRoute() {
            let self=this;
            self.$router.push({
                "name": "addRoute"
            });
        },
        deleteRoute(zoneId){
            let self=this;
            self.$Modal.confirm({
                "title": "确认删除该路线信息吗？",
                "onOk": () => {
                    yd.ajax({
                        "url": "../apiprovince/zone/deleteZoneInfo",
                        "data": {
                            "zoneId": zoneId
                        },
                        success () {
                            self.$Message.success("删除成功！");
                            self.loadTable();
                        },
                        error () {
                            self.$Message.error("删除失败！");
                        }
                    });
                }
            });

        },
        showDetail({zoneId,zoneType}){
            let self=this;
            self.$router.push({
                "name": "routeDetail",
                "query": {
                    "zoneId": zoneId,
                    "zoneType": zoneType
                }
            });
        },
        editRoute(zoneId){
            let self=this;
            self.$router.push({
                "name": "editRoute",
                "query": {
                    "zoneId": zoneId
                }
            });
        }
    }
};