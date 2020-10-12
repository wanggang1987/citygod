import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";
import Weather from "./components/weather.vue";
import RankInAndOut from "./components/rankInAndOut.vue";
import pie3D from "./components/pie3D.vue";
import Map from "./components/map.vue";
import AbnormalPush from "./components/abnormalPush.vue";
import RealTimeMonitor from "./components/realTimeMonitor.vue";
import vehicleDetailModal from "./components/vehicleDetailModal.vue";

export default {
    "name": "bigScreen",
    "components": {
        Weather,
        RankInAndOut,
        pie3D,
        Map,
        AbnormalPush,
        RealTimeMonitor,
        vehicleDetailModal
    },
    data () {
        const self = this;
        return {
            "token": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiaGFpZ3VhbjAxIiwiaXAiOiIxMjcuMC4wLjEiLCJtb2R1bGUiOiJ3ZWJwcm92aW5jZSIsInVzZXJJZCI6IjEiLCJyb2xlcyI6W10sInRpbWVTdGFtcCI6MTU4Njc2MTA2Nzg3Nn0.DUAXtVf4WsB0WCOhLcz9jxv5VuaU7E6qo6jwxTxKRCXY3mb4e2D9mYg0uGW8LZYpyb1HBQPD_W0HL-oDtApsCw",
            "day": new Date().Format("yyyy年MM月dd日"),
            "week": new Date().getDay(),
            "titleindex": "image1",
            "titlelistShow": false,
            "vehicleModal": false,
            "vehicleData": {},
            "alarmpoint": {},
            "vehicleLine": {},
            "list": [
                "南京海关“慧眼通”智慧物流监管平台·车辆监管模块",
                "无锡海关“慧眼通”智慧物流监管平台·车辆监管模块",
                "无锡海关智慧综保区监管平台·车辆监管模块",
                "无锡高新综保区“慧眼通”智慧物流监管平台·车辆监管模块",
                "无锡高新物流智慧场站展示平台·车辆监管模块"
            ],
            "title": "无锡海关“慧眼通”智慧物流监管平台·车辆监管模块"
        };
    },
    "watch": {
        "vehicleModal": function (val) {
            let self=this;
            // 3分钟刷新

            if (val){
                clearInterval(self.mapinterval);
            } else {
                self.mapinterval=setInterval(function () {
                    self.$refs.map.loadMapData();
                },60*1000*3);
            }
        }
    },
    mounted () {
        let self=this;
        // 3分钟刷新
        self.mapinterval=setInterval(function () {
            self.$refs.map.loadMapData();
        },60*1000*3);
        // 30s刷新
        setInterval(function () {
            self.$refs.pie.loadData();
            self.$refs.map.loadLeftData();
            self.$refs.RankInAndOut.query();
        },30*1000);
    },
    "methods": {
        queryWeek (week) {
            const map = {
                "0": "日",
                "1": "一",
                "2": "二",
                "3": "三",
                "4": "四",
                "5": "五",
                "6": "六"
            };
            return map[week];
        },
        changeTitle(index){
            let self=this;
            switch (index){
                case 1:
                    self.titleindex="image1";
                    break;
                case 2:
                    self.titleindex="image2";
                    break;
                case 3:
                    self.titleindex="image3";
                    break;
                case 4:
                    self.titleindex="image4";
                    break;
            }
        },
        openModal(data){
            const self=this;
            self.vehicleModal=false;
            setTimeout(function () {
                self.vehicleModal=true;
                self.vehicleData=data;
            },50);
        },
        alarmPoint(data){
            const self=this;
            self.alarmpoint=data;
        },
        addLine(data){
            const self=this;
            self.vehicleLine=data;
        }

    }
};