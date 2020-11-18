import mixins from "../doorMagnetic.vue";
import * as SubConfig from "@/libs/SubConfig";
import * as yd from "@/libs/yd";

export default {
    "name": "doorMagneticDetails",
    "mixins": [mixins],
    data () {
        const self = this;
        return {
            "queryUrl": "../apiprovince/vehicleAlarm/selectVehicleAlarmMagnetismRspPage",
            "exportUrl": "../apiprovince/vehicleAlarm/exportVehicleAlarmMagnetismRspPage",
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
                    "title": "企业名称",
                    "key": "companyName",
                    "tooltip": true,
                    "minWidth": 120
                },{
                    "title": "传感器状态",
                    "key": "magnetismAction",
                    "minWidth": 110,
                    "render": (h, params) => {
                        return self.tooltipRender(h, SubConfig.magnetismStatus[params.row.magnetismAction]);
                    }
                },{
                    "title": "时间",
                    "key": "alarmTime",
                    "minWidth": 140,
                    "render": (h, params) => {
                        const alarmTime = params.row.alarmTime;
                        const time = alarmTime ? new Date(alarmTime).Format("yyyy-MM-dd hh:mm:ss") : "--";
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
                        if (!params.row.address) {
                            const item = params.row;
                            yd.getLocation({
                                "lat": item.gpsLat,
                                "lng": item.gpsLng
                            }, (address) => {
                                self.$set(item, "address", address || "未知");
                            });
                        }
                        return self.tooltipRender(h, params.row.address);
                    }
                }

            ]
        };
    },
    created () {
        const self = this;
        const params = self.$route.query;
        if (params.vehicleId) self.vehicleId = params.vehicleId;
        if (params.carLicense) self.carLicense = params.carLicense;
        if (params.status) self.status = params.status;
        if (params.startTime && params.endTime) {
            self.date = [new Date(params.startTime), new Date(params.endTime)];
        }
        
    },
    "methods": {
        search () {
            const self = this;
            self.pageNo = 1;
            self.params = {
                "vehicleId": self.vehicleId || null,
                "companyId": self.companyId || null, //所属企业
                "startTime": new Date(self.date[0].Format("yyyy-MM-dd 00:00:00")).getTime(),// 开始时间
                "endTime": new Date(self.date[1].Format("yyyy-MM-dd 23:59:59")).getTime(),// 结束时间
                "magnetismStatus": self.status != "-1" ? self.status : null // 传感器状态
            };

            self.loadTable();
        }
    }
};