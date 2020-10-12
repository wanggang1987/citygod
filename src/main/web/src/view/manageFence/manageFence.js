import * as yd from "@/libs/yd";
import { generateList } from "@/libs/tools";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import tableBase from "_m/tableBase";

export default {
    "name": "manageFence",
    "mixins": [tableBase],
    "components": {
        "loading-spining": loadingSpin
    },
    data () {
        const self = this;
        return {
            "fencesName": "",
            "type": "-1",
            "typeList": generateList(SubConfig.documentType),
            "status": "-1",
            "statusList": generateList(SubConfig.fenceStatus),
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "操作",
                    "key": "action",
                    "minWidth": 250,
                    "render": (h, params) => {
                        const edit = h("a", {
                            "class": "pr10",
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.edit(params.row);
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
                                    self.view(params.row);
                                }
                            }
                        }, "查看");

                        const del = h("a", {
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.del(params.row);
                                }
                            }
                        }, "删除");
                        return  h("div", self.isAdmin ? [edit, view, del] : [view]);
                    }
                },{
                    "title": "围栏名称",
                    "key": "zoneName",
                    "minWidth": 200,
                    "tooltip": true
                },{
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
                },{
                    "title": "状态",
                    "key": "zoneStatus",
                    "minWidth": 60,
                    "render": (h, params) => {
                        return self.tooltipRender(h, SubConfig.fenceStatus[params.row.zoneStatus]);
                    }
                }
            ]
        };
    },
    "computed": {
        isAdmin () {
            return this.$store.state.user.userName === "admin";
        }
    },
    created () {
        const self = this;
        let params = self.$route.query;
        self.fencesName = params.zoneName || "";
        self.type = params.zoneType || "-1";
        self.status = params.zoneStatus || "-1";
    },
    mounted () {
        const self = this;
        self.search();
    },
    "methods": {
        search () {
            const self = this;
            self.params = {
                "zoneId": null, // 路线ID或围栏ID
                "zoneType": 1, // 0：路线  1：围栏
                "zoneName": self.fencesName || null, // 路线或围栏名称
                "documentType": self.type != "-1" ? self.type : null, // 单证类型
                "zoneStatus": self.status != "-1" ? self.status : null // 状态 1启用 0禁用
            };
            self.pageNo = 1;
            self.loadTable();
        },
        loadTable () {
            const self = this;
            self.spinShow = true;
            let params = {
                ...self.params,
                "pageNo": self.pageNo,
                "pageSize": self.pageSize
            };
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.list || [];
                    self.total = json.totalCount || 0;
                },
                error () {
                    self.tableData = [];
                    self.total = 0;
                },
                complete () {
                    self.spinShow = false;
                }
            });

        },
        add () {
            this.$router.push({
                "name": "addFence"
            });
        },
        edit ({ zoneId }) {
            this.$router.push({
                "name": "editFence",
                "query": {
                    "zoneId": zoneId
                }
            });
        },
        view ({ zoneId }) {
            this.$router.push({
                "name": "fenceDetail",
                "query": {
                    "zoneId": zoneId
                }
            });
        },
        del ({ zoneId }) {
            const self = this;
            self.$Modal.confirm({
                "title": "确认删除该围栏信息吗？",
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
        }
    }
};