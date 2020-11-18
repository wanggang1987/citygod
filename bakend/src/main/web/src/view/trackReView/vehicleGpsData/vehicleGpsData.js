import * as yd from "@/libs/yd";
import config from "@/config";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import {getAreaId} from "@/libs/util";
import tableBase from "_m/tableBase";

export default {
    "name": "vehicleGpsData",
    "mixins": [tableBase],
    data() {
        const self = this;
        return {
            "timeOrderType": "",
            "speedOrderType": "",
            "tableData": [],
            "columnsTarck": [
                {
                    "title": "序号",
                    "width": 60,
                    "fixed": "left",
                    "render": (h, params) => {
                        let number=   params.index + (self.pageNo - 1) * self.pageSize + 1;
                        return number;
                    }
                }, {
                    "title": "车牌号",
                    "key": "carLicense",
                    "width": 120,
                    "fixed": "left",
                    "render": (h, params) => {
                        return h("div", [h("span", {
                            "style": {
                                "display": "inline-block",
                                "margin-right": "13px",
                                "color": params.row.supply == 1 ? "#5a5a5a" : "#5a5a5a"
                            }
                        },
                        params.row.carLicense), h("span", {
                            "style": {
                                "color": params.row.supply == 1 ? "#5a5a5a" : "#5a5a5a"
                            }
                        },
                        SubConfig.plateColor[params.row.plateColor])]);
                    }
                },  {
                    "title": "企业名称",
                    "key": "carLicense",
                    "fixed": "left",
                    "width": 150,
                    "render": (h, params) => {
                        return h("div", [h("span", {
                            "style": {
                                "display": "inline-block",
                                "margin-right": "13px",
                                "color": params.row.supply == 1 ? "#5a5a5a" : "#5a5a5a"
                            }
                        },
                        params.row.groupName)]);
                    }
                }, {
                    "title": "GPS时间",
                    "key": "time",
                    "width": 160,
                    "fixed": "left",
                    // "sortable": "custom",
                    "className": "gpsTime",
                    "render": (h, params) => {
                        return h("span", {
                            "style": {
                                "color": params.row.supply == 1 ? "#5a5a5a" : "#5a5a5a"
                            }
                        },
                        params.row.time);
                    }
                },  {
                    "title": "速度(km/h)",
                    "key": "speed",
                    "width": 100,
                    // "sortable": "custom",
                    "className": "speed",
                    "render": (h, params) => {
                        return h("span", {
                            "style": {
                                "color": params.row.supply == 1 ? "#5a5a5a" : "#5a5a5a"
                            }
                        },
                        params.row.speed);
                    }
                }, {
                    "title": "接收时间",
                    "key": "supplyTime",
                    "width": 200,
                    "className": "speed",
                    "render": (h, params) => {
                        let supplyTime = params.row.supplyTime;
                        let str = supplyTime ? new Date(params.row.supplyTime).Format("yyyy-MM-dd hh:mm:ss") : "";
                        return str ? (params.row.supply === 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        str) : str) : "--";
                    }
                }, {
                    "title": "传输标记",
                    "key": "supply",
                    "width": 95,
                    "className": "speed",
                    "render": (h, params) => {
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#108ee8"
                            }}, "补传") : "实时";
                    }
                }, {
                    "title": "方向",
                    "key": "speed",
                    "width": 110,
                    "className": "speed",
                    "render": (h, params) => {
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        yd.angle(params.row.direction)) : yd.angle(params.row.direction);
                    }
                }, {
                    "title": "经度",
                    "key": "lng",
                    "width": 95,
                    "className": "speed",
                    "render": (h, params) => {
                        let str = params.row.lngAccuracy.toFixed(6);
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        }, str) : str;
                    }
                }, {
                    "title": "纬度",
                    "key": "lat",
                    "width": 120,
                    "className": "speed",
                    "render": (h, params) => {
                        let str = params.row.latAccuracy.toFixed(6);
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        }, str) : str;
                    }
                },{
                    "title": "里程(km)",
                    "key": "mileage",
                    "width": 95,
                    "className": "speed",
                    "render": (h, params) => {
                        let str = (params.row.mileage / 10).toFixed(1);
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        str) : str;

                    }
                }, {
                    "title": "卫星颗数",
                    "key": "gnns",
                    "width": 95,
                    "className": "speed",
                    "render": (h, params) => {
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        params.row.gnns) : params.row.gnns;
                    }
                }, {
                    "title": "网络信号强度",
                    "key": "wirelessstrength",
                    "width": 120,
                    "className": "speed",
                    "render": (h, params) => {
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        params.row.wirelessstrength) : params.row.wirelessstrength;
                    }
                },  {
                    "title": "地理位置",
                    "key": "address",
                    "width": 400,
                    "className": "speed",
                    "render": (h, params) => {
                        return params.row.supply == 1 ? h("span", {
                            "style": {
                                "color": "#5a5a5a"
                            }
                        },
                        params.row.address) : h("span", {},
                            params.row.address);
                    }
                }
            ]

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
        }, "endTime": {
            "type": Object,
            "default": new Date()
        }, "vehicleId": {
            "type": Number,
            "default": 0
        }, "total": {
            "type": Number,
            "default": 0
        }, "height": {
            "type": Number,
            "default": 0
        }, "querySupply": {
            "type": Boolean,
            "default": false
        }

    },
    "watch": {
        value(){
            if (this.value){
                this.pageNo=1;
            }
            if (this.value&&this.vehicleId){
                this.loadTable();
            }
        }
    },
    mounted(){
    },
    "methods": {
        loadTable() {
            let _this = this;
            let data = {
                "vehicleId": _this.vehicleId,
                "startTime": _this.startTime.getTime(),
                "endTime": _this.endTime.getTime(),
                "pageNo": _this.pageNo,
                "pageSize": _this.pageSize,
                // "timeOrderType": _this.timeOrderType,
                // "speedOrderType": _this.speedOrderType,
                "querySupply": _this.querySupply
            };
            yd.ajax({
                "url": "/apiprovince/trackplayback/queryGpsPage",
                "type": "POST",
                "dataType": "json",
                data,
                "contentType": "application/json;charset=utf-8",
                success(data) {
                    _this.$emit("input",false);
                    _this.tableData = data == "" ? [] : data;

                    $.each(_this.tableData,
                        function (i, v) {
                            Vue.set(_this.tableData[i], "time", new Date(_this.tableData[i].time).Format("yyyy-MM-dd hh:mm:ss"));
                            yd.getLocation({
                                "lat": _this.tableData[i].latAccuracy,
                                "lng": _this.tableData[i].lngAccuracy
                            },
                            function (address) {
                                Vue.set(_this.tableData[i], "address", address ? address : "此位置无法解析");
                            });
                        });
                },
                //此次提交增加的方法
                complete() {
                }
            });

        },
        sortTarck(sortTack) {
            this.pageNo = 1;
            this.tableData = [];
            this.timeOrderType = undefined;
            this.speedOrderType = undefined;
            if (sortTack.key == "speed") {
                this.speedOrderType = sortTack.order == "asc" ? 0 : 1;
                if (sortTack.order == "normal") this.speedOrderType = 0;
            } else {
                this.timeOrderType = sortTack.order == "asc" ? 0 : 1;
                if (sortTack.order == "normal") this.timeOrderType = 0;
            }
            this.loadTable(this);
        }

    }
};