import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import { generateList } from "@/libs/tools";
import loadingSpin from "_c/loading-spin";
import tabletip from "_c/table-tip";
import enterpriseAutoComplete from "_c/autoComplete/enterprise";
import carLicenseAutoComplete from "_c/autoComplete/carLicense";
import waybillAutoComplete from "_c/autoComplete/waybillNo";
import picGroupFixPlayer from "_c/picGroupFixPlayer";
import tableBase from "_m/tableBase";

export default {
    "name": "queryAlarm",
    "mixins": [tableBase],
    "components": {
        "enterprise-auto-complete": enterpriseAutoComplete,
        "carlincense-auto-complete": carLicenseAutoComplete,
        "waybill-auto-complete": waybillAutoComplete,
        "picGroupFixPlayer": picGroupFixPlayer,
        "loading-spining": loadingSpin,
        "tabletip": tabletip
    },
    data () {
        const self = this;
        return {
            "vehicleId": "",
            "companyId": "",
            "enterpriseName": "",
            "waybillNo": "",
            "alarmType": "-1",
            "alarmTypeList": (() => {
                let arr = [
                    {
                        "value": "-1",
                        "label": "全部"
                    }
                ];
                SubConfig.earlyWarnType.forEach((item) => {
                    arr.push({
                        "value": item,
                        "label": SubConfig.alarmType[item]
                    });
                });
                return arr;
            })(),
            "date": [new Date(new Date().Format("yyyy-MM-dd 00:00:00")), new Date(new Date().Format("yyyy-MM-dd 23:59:59"))],
            "status": "-1", 
            "statusList": generateList(SubConfig.handleStatus),
            "columns": [
                {
                    "title": "序号",
                    "fixed": "left",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "附件",
                    "fixed": "left",
                    "minWidth": 80,
                    "render": (h, params) => {
                        let child = [
                            h("a", {
                                "style": {
                                    "color": "#2059EF"
                                },
                                "on": {
                                    "click": () => {
                                        self.view(params.row);
                                    }
                                }
                            }, "附件")
                        ];
                        return h("div", params.row.fileId || params.row.alarmType == 40002 || params.row.alarmType == 40003 ? child : "--");
                    }
                },{
                    "title": "车牌号",
                    "fixed": "left",
                    "key": "carLicense",
                    "minWidth": 120,
                    "render": (h, params) => {
                        let carLicense = params.row.carLicense;
                        const plateColor = SubConfig.plateColor[params.row.plateColor];
                        carLicense = plateColor ? `${carLicense} ${plateColor}` : carLicense;
                        return self.tooltipRender(h, carLicense);
                    }
                },{
                    "title": "预警类型",
                    "fixed": "left",
                    "key": "alarmType",
                    "minWidth": 150,
                    "render": (h, params) => {
                        const alarmType = SubConfig.alarmType[params.row.alarmType];
                        return self.tooltipRender(h, alarmType);
                    }
                },{
                    "title": "单证号",
                    "key": "waybillNo",
                    "tooltip": true,
                    "minWidth": 200
                },{
                    "title": "企业名称",
                    "key": "companyName",
                    "tooltip": true,
                    "minWidth": 200
                },{
                    "title": "预警时间",
                    "key": "alarmTime",
                    "minWidth": 165,
                    "render": (h, params) => {
                        const alarmTime = new Date(params.row.alarmTime).Format("yyyy-MM-dd hh:mm:ss");
                        return self.tooltipRender(h, alarmTime);
                    }
                },{
                    "title": "处理状态",
                    "key": "handleStatus",
                    "minWidth": 140,
                    "render": (h, params) => {
                        const status = params.row.handleStatus;
                        const handleStatus = SubConfig.handleStatus[status];
                        let child = [h("span", {
                            "class": "dib vam circle mr4",
                            "style": {
                                "width": "8px",
                                "height": "8px",
                                "background": status ? "#45B854" : "#E02020"
                            }
                        }), handleStatus];
                        return h("div", child);
                    }
                },{
                    "title": "处理人",
                    "key": "handleOperator",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return self.tooltipRender(h, params.row.handleOperator);
                    }
                },{
                    "title": "预警处理时间",
                    "key": "handleTime",
                    "minWidth": 165,
                    "render": (h, params) => {
                        const handleTime = params.row.handleTime;
                        const time = handleTime ? new Date(handleTime).Format("yyyy-MM-dd hh:mm:ss") : "--";
                        return self.tooltipRender(h, time);
                    }
                },{
                    "title": "速度(Km/h)",
                    "key": "speed",
                    "minWidth": 110
                },{
                    "title": "地理位置",
                    "key": "address",
                    "minWidth": 305,
                    "render": (h, params) => {
                        return self.tooltipRender(h, params.row.address);
                    }
                }
            ],
            "viewFlag": false,
            "picData": []
        };
    },
    "computed": {
        isAdmin () {
            return this.$store.state.user.userName === "admin";
        }
    },
    created () {
        const self = this;
        const params = self.$route.query;
    },
    mounted() {
        this.search();
    },
    "methods": {
        search () {
            const self = this;
            self.pageNo = 1;
            self.params = {
                "vehicleId": self.vehicleId || null,
                "companyId": self.companyId || null, //所属企业
                "alarmType": self.alarmType != "-1" ? self.alarmType : null, //预警类型
                "startTime": self.date[0].getTime(), // 开始时间
                "endTime": self.date[1].getTime(), // 结束时间
                "waybillNo": self.waybillNo || null, // 单证号
                "handleStatus": self.status != "-1" ? self.status : null // 处理状态
            };

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
                "url": "../apiprovince/vehicleAlarm/selectVehicleAlarmExtendPage",
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.list || [];
                    self.total = json.count || 0;

                    self.tableData.forEach((item, i) => {
                        yd.getLocation({
                            "lat": item.gpsLat,
                            "lng": item.gpsLng
                        }, (address) => {
                            self.$set(item, "address", address || "未知");
                        });
                    });
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
        view (json) {
            const self = this;
            if (json.alarmType == 40002 || json.alarmType == 40003) {
                self.$router.push({
                    "name": "trackReView",
                    "query": {
                        "startTime": json.startTime || null,
                        "endTime": json.endTime || null,
                        "vehicleId": json.vehicleId || null
                    }
                });
            } else {
                self.viewFlag = true;
                self.picData = [json.fileId];
            }

        },
        exportTable () {
            const self = this;
            yd.exportFile("../apiprovince/vehicleAlarm/exportVehicleAlarmExtendPage", self.params, "POST");
        },
        //企业输入联想
        changeEnterprise (id) {
            this.companyId = id;
        },
        changecarLicense (id) {
            this.vehicleId = id;
        },
        changeDate ([ startDate, endDate ], type) {
            if (type == "date") this.date = [new Date(startDate), new Date(endDate.replace("00:00:00", "23:59:59"))];
        }
    }

};