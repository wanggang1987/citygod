import * as yd from "@/libs/yd";
import config from "@/config";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import tableBase from "_m/tableBase";


export default {
    "name": "alarmTable",
    "mixins": [tableBase],
    data() {
        const self = this;
        return {
            "tableData": [],
            "startTimeDirect": "",
            "startSpeedDirect": "",
            "columnsIncident": [{
                "title": "序号",
                "width": 80,
                "fixed": "left",
                "className": "rowShow",
                "render": function(h, parmas) {
                    return parmas.index + (self.pageNo - 1) * self.pageSize + 1;
                }
            }, {
                "title": "预警类型",
                "key": "alarmTypeId",
                "width": 180,
                "fixed": "left",
                "className": "happenTime",
                "render": (h, params) => {
                    let child = [SubConfig.alarmType[params.row.alarmType]];
                    if (params.row.fileId) {child.push(h("a", {
                        "class": "ml8 iconfont icon_fujian fs12",
                        "style": {
                            "color": "#0F55CF"
                        },
                        "on": {
                            click() {
                                self.$emit("fileClick", [params.row.fileId]);
                            }
                        }
                    }));}
                    return h("div", child);
                }
            }, {
                "title": "车牌号",
                "key": "carLicense",
                "width": 120,
                "className": " happenTime",
                "render": (h, params) => {
                    return h("div", [
                        h("span", {
                            "style": {
                                "display": "inline-block",
                                "margin-right": "13px"

                            }
                        }, params.row.carLicense), 
                        h("span", {}, SubConfig.plateColor[params.row.plateColor])
                    ]);
                }
            }, {
                "title": "单证号",
                "key": "waybillNo",
                "tooltip": true,
                "minWidth": 200
            }, {
                "title": "企业名称",
                "width": 120,
                "className": "happenTime",
                "render": (h, params) => {
                    return params.row.companyName == null ? "--" : params.row.companyName;
                }
            }, {
                "title": "预警时间",
                "width": 200,
                "className": "happenTime",
                "render": (h, params) => {
                    return params.row.alarmTime == null ? "--" : new Date(params.row.alarmTime).Format("yyyy-MM-dd hh:mm:ss");
                }
            }, {
                "title": "处理状态",
                "width": 120,
                "className": "happenTime",
                "render": (h, params) => {
                    return SubConfig.handleStatus[params.row.handleStatus] ? h("span", { "style": { "color": params.row.handleStatus ? "green" : "red" } }, SubConfig.handleStatus[params.row.handleStatus]) : "--";
                }
            }, {
                "title": "处理人",
                "width": 120,
                "className": "happenTime",
                "render": function(h, parmas) {
                    return parmas.row.handleOperator ? parmas.row.handleOperator : "--";
                }
            }, {
                "title": "预警处理时间",
                "width": 180,
                "className": "happenTime",
                "render": function(h, parmas) {
                    return parmas.row.handleTime == null ? "--" : new Date(parmas.row.handleTime).Format("yyyy-MM-dd hh:mm:ss");
                }

            }, {
                "title": "速度（km/h）",
                "key": "speed",
                "width": 180,
                "className": "happenTime"
            }]
        };
    },
    "props": {
        "value": {
            "type": Boolean,
            "default": false
        },
        "startTime": {
            "type": Object,
            "default": new Date()
        },
        "endTime": {
            "type": Object,
            "default": new Date()
        },
        "vehicleId": {
            "type": Number,
            "default": 0
        },
        "total": {
            "type": Number,
            "default": 0
        },
        "height": {
            "type": Number,
            "default": 0
        },
        "alarmTypes": {
            "type": String,
            "default": null
        }

    },
    "watch": {
        value() {
            if (this.value) {
                this.pageNo = 1;
            }
            if (this.value && this.vehicleId) {
                this.loadTable();
            }
        }
    },
    "methods": {
        loadTable() {
            const self = this;
            let params = {
                "vehicleId": self.vehicleId,
                // 车辆id 必传
                "startTime": self.startTime.getTime(),
                // 开始查询时间 必传
                "endTime": self.endTime.getTime(),
                // 截至查询时间 必传
                "pageNo": self.pageNo,
                "pageSize": self.pageSize
            };

            params.alarmType = self.alarmTypes;
            yd.ajax({
                "url": "/apiprovince/vehicleAlarm/selectVehicleAlarmExtendPage",
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.list == "" ? [] : json.list;
                    self.total = json.count ? json.count : 0;
                },
                //此次提交增加的方法
                complete () {
                    self.$emit("input", false);
                }
            });

        },
        "sortIncident": function(sortIncident) {
            this.startTimeDirect = "";
            this.startSpeedDirect = "";
            this.pageNo = 1;
            if (sortIncident.column.title == "报警开始时间") {
                if (sortIncident.order == "asc") this.startTimeDirect = "ASC";
                if (sortIncident.order == "desc") this.startTimeDirect = "DESC";
                if (sortIncident.order == "normal") this.startTimeDirect = "";
            }
            if (sortIncident.column.title == "开始速度（km/h）") {
                if (sortIncident.order == "asc") this.startSpeedDirect = "ASC";
                if (sortIncident.order == "desc") this.startSpeedDirect = "DESC";
                if (sortIncident.order == "normal") this.startSpeedDirect = "";
            }
            this.loadTable(this);
        }

    }
};