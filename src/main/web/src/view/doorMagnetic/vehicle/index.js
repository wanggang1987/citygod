import mixins from "../doorMagnetic.vue";
import * as SubConfig from "@/libs/SubConfig";

export default {
    "name": "vehicle",
    "mixins": [mixins],
    data () {
        const self = this;
        return {
            "queryUrl": "../apiprovince/vehicleAlarm/selectVehicleAlarmStatMagnetismPage",
            "exportUrl": "../apiprovince/vehicleAlarm/exportVehicleAlarmStatMagnetismPage",
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "车牌号",
                    "key": "carLicense",
                    "minWidth": 120,
                    "render": (h, params) => {
                        let carLicense = params.row.carLicense;
                        const plateColor = SubConfig.plateColor[params.row.plateColor];
                        carLicense = plateColor ? `${carLicense} ${plateColor}` : carLicense;
                        return self.tooltipRender(h, carLicense);
                    }
                },{
                    "title": "当前传感器状态",
                    "key": "currentMagnetismStatus",
                    "minWidth": 110,
                    "render": (h, params) => {
                        return self.tooltipRender(h, SubConfig.magnetismStatus[params.row.currentMagnetismStatus]);
                    }
                },{
                    "title": "企业名称",
                    "key": "companyName",
                    "tooltip": true,
                    "minWidth": 120
                },{
                    "title": "传感器打开次数",
                    "key": "magnetismActionOpenCount",
                    "sortable": "custom",
                    "minWidth": 120,
                    "render": (h, params) => {
                        const magnetismActionOpenCount = params.row.magnetismActionOpenCount || 0;
                        return h("a", {
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.view(params.row);
                                }
                            }
                        }, magnetismActionOpenCount);
                    }
                },{
                    "title": "传感器关闭次数",
                    "key": "magnetismActionCloseCount",
                    "sortable": "custom",
                    "minWidth": 120,
                    "render": (h, params) => {
                        const magnetismActionCloseCount = params.row.magnetismActionCloseCount || 0;
                        return h("a", {
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.view(params.row, "1");
                                }
                            }
                        }, magnetismActionCloseCount);
                    }
                }

            ]
        };
    },
    "methods": {
        search () {
            const self = this;
            self.pageNo = 1;
            self.params = {
                "vehicleId": self.vehicleId || null,
                "companyId": self.companyId || null, //所属企业
                "startDay": self.date[0].Format("yyyyMMdd"),// 开始时间
                "endDay": self.date[1].Format("yyyyMMdd"),// 结束时间
                "magnetismStatus": self.status != "-1" ? self.status : null // 传感器状态
            };

            self.loadTable();
        },
        view (json, magnetismStatus = "0") {
            const self = this;
            let carLicense = json.carLicense;
            const plateColor = SubConfig.plateColor[json.plateColor];
            carLicense = plateColor ? `${carLicense} ${plateColor}` : carLicense;
            self.$parent.notCacheName.push("doorMagneticDetails"); // 列表跳转需清除缓存之后跳转
            self.$nextTick(() => {
                self.$parent.notCacheName = [];
                self.$router.push({
                    "name": "details",
                    "query": {
                        "vehicleId": json.vehicleId,
                        "carLicense": carLicense,
                        "status": magnetismStatus,
                        "startTime": self.date[0].Format("yyyy-MM-dd"),
                        "endTime": self.date[1].Format("yyyy-MM-dd")
                    }
                });
            });
        }
    }

};