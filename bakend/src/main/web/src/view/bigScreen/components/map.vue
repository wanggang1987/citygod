<template>
    <div class="panel" :style="{'height': height}">
        <div class="mapbox">
            <div id="bigScreenMap"></div>
            <ul>
                <li>
                    <div class="name">车辆在线数</div>
                    <div class="num">{{format_number(leftMsg.onlineVehicleCount)}}<span class="unit"></span></div>
                </li>
                <li>
                    <div class="name">车辆在途数</div>
                    <div class="num">{{format_number(leftMsg.onWayVehicleCount)}}<span class="unit"></span></div>
                </li>
                <li>
                    <div class="name">车辆异常数</div>
                    <div class="num">{{format_number(leftMsg.notHandleVehicleCount)}}<span class="unit"></span></div>
                </li>
                <li>
                    <div class="legend">在线</div>
                    <div class="legend">在途</div>
                    <div class="legend">异常</div>
                </li>
            </ul>
            <div class="goAllScreen" @click="goAllScreen">
                <div><i class="iconfont icon_qj_screen"></i></div>
                <div>全景大屏</div>
            </div>
            <div class="imageBtn" :class="currentPoint" @click="jumpPoint">
                <div class="name">{{!showOnWay?"同企跨片":"在线车辆"}}</div>
            </div>
        </div>
        <div class="panel-footer"> </div>
    </div>
</template>
<script>
import * as SubConfig from "@/libs/SubConfig";
import $ from "jquery";
import * as mapStyle from "./mapStyle";
import * as yd from "@/libs/yd";
import liveVideo from "./live-video";
import startPoint from "@/assets/images/sp_start.png";
import endPoint from "@/assets/images/sp_end.png";

export default {
    "name": "Map",
    "components": {
        "live-video": liveVideo
    },
    "props": {
        "height": {
            "type": String,
            "default": "644px"
        },
        "token": {
            "type": String,
            "default": ""
        },
        "alarmpoint": {
            "type": Object,
            "default": {}
        },
        "showline": {
            "type": Object,
            "default": {}
        }
    },
    data() {
        const self = this;
        return {
            "vehicleMap": {},
            "leftMsg": {
                "onlineVehicleCount": 0,
                "notHandleVehicleCount": 0,
                "onWayVehicleCount": 0
            },
            // "aPoint": [120.408799, 31.540674],
            // "bPoint": [120.387677, 31.542815],
            "showOnWay": false,
            "route": [],
            "markers": [] // 存储车辆覆盖物
        };
    },
    "watch": {
        "alarmpoint": function(val) {
            const self = this;
            if (val.flag) {
                const icon = new BMap.Icon(require("@/assets/images/bigScreen/alarm.png"), new BMap.Size(32, 32), { //小车图片
                    // anchor: new BMap.Size(-32,32) //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                let pt = new BMap.Point(val.lng, val.lat);
                self.alarmMarker = new BMap.Marker(pt, { "icon": icon });

                let str = "<div class=\"alarmLab\"><div class=\"labWap tac\" >" + val.title + "</div></div>";
                let label = new BMap.Label(str, { "offset": new BMap.Size(0 - (val.title.length * 14 + 10) / 2 + 16, -31) });
                label.setStyle({
                    "backgroundColor": "none",
                    "display": "inline",
                    "border": "0",
                    "padding": "0"
                });
                self.alarmMarker.setLabel(label);
                self.map.addOverlay(self.alarmMarker);
                self.map.setCenter(pt);
            } else {
                self.map.removeOverlay(self.alarmMarker);
                self.alarmMarker = "";
            }
        },
        "showline": function(val) {
            const self = this;
            if (val.flag) {
                self.loadLine(val.vehicleId, val.startTime);
            } else {
                self.clearLine();
            }
        }
    },
    mounted() {
        const self = this;
        self.loadMap();
        self.loadLeftData();
        self.loadMapData();
        self.queryZone(); // 加载围栏信息
    },
    "methods": {
        loadMap() {
            const self = this;
            // 百度地图API功能
            self.map = new BMap.Map("bigScreenMap", { 
                "enableMapClick": false 
            });
            let poi = new BMap.Point(120.408799, 31.540674);
            self.map.centerAndZoom(poi, 16);
            self.map.enableScrollWheelZoom();
            self.map.setMapStyle({ 
                "styleJson": mapStyle.mapStyle 
            });
            self.map.addEventListener("click", function(e){
                if (e.domEvent.target.className=="BMap_Marker BMap_noprint"||e.domEvent.target.className=="labWap tac"){
                    const vehicleId = e.overlay.vehicleId;
                    const data = self.vehicleMap[vehicleId];
                    if (data) self.$emit("open-modal", data);
                }
            });
        },
        loadLeftData() {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/bigScreen/getVehicleMapData",
                "headers": {
                    "Authorization": self.token
                },
                success(json) {
                    self.leftMsg = json;
                }
            });
        },
        jumpPoint() {
            const self = this;
            self.showOnWay = !self.showOnWay;
            self.loadMapData();
        },
        format_number(n) {
            return yd.formatNum(n);
        },
        loadMapData() {
            const self = this;
            self.markers.forEach((item) => {
                self.map.removeOverlay(item);
            });
            self.markers = [];
            if (!self.showOnWay) {
                yd.ajax({
                    "url": "/apiprovince/bigScreen/getScreenAllVehicleOnlineList",
                    "headers": {
                        "Authorization": self.token
                    },
                    success(json) {
                        self.darwVehicle(json);
                    },
                    complete () {
                        self.queryVehicleOnWay();
                    }
                });
            } else {
                self.queryVehicleOnWay();
            }
        },
        queryVehicleOnWay () {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/bigScreen/getScreenAllVehicleOnWayList",
                "headers": {
                    "Authorization": self.token
                },
                success(json) {
                    self.darwVehicle(json, true);
                }
            });
        },
        darwVehicle(json, type) {
            const self = this;
            const onlineicon = new BMap.Icon(require("@/assets/images/bigScreen/car_online.png"), new BMap.Size(20, 45), { //小车图片
                // anchor: new BMap.Size(25,40) //图片的偏移量。为了是图片底部中心对准坐标点。
            });
            const alarmicon = new BMap.Icon(require("@/assets/images/bigScreen/car_alarm.png"), new BMap.Size(20, 45), { //小车图片
                // anchor: new BMap.Size(25,40) //图片的偏移量。为了是图片底部中心对准坐标点。
            });
            const onwayicon = new BMap.Icon(require("@/assets/images/bigScreen/car_onway.png"), new BMap.Size(20, 45), { //小车图片
                // anchor: new BMap.Size(25,40) //图片的偏移量。为了是图片底部中心对准坐标点。
            });

            $.each(json, function(i, item) {
                let pt = new BMap.Point(item.gpsLng, item.gpsLat);
                let marker = new BMap.Marker(pt, { "icon": item.ifHasNoHandleAlarm ? alarmicon : (type ? onwayicon : onlineicon) });
                let str = `<div class="mapLab${type ? " onway" : ""}${item.ifHasNoHandleAlarm ? " alarm" : "" }" dataId="${item.vehicleId}"><div class="labWap tac" >${item.carLicense }</div></div>`;
                let label = new BMap.Label(str, { 
                    "offset": new BMap.Size(-32, -31) 
                });
                label.setStyle({
                    "backgroundColor": "none",
                    "display": "inline",
                    "border": "0",
                    "padding": "0"
                });
                marker.setLabel(label);
                marker.setRotation(item.direction);
                marker.vehicleId = item.vehicleId;
                self.map.addOverlay(marker);
                self.vehicleMap[item.vehicleId] = item;
                self.markers.push(marker);
            });
        },
        loadLine(vehicleId, startTime) {
            const self = this;
            self.hideMarker = [];
            let arr = [];
            self.markers.forEach((item) => {
                if (item.vehicleId) {
                    if (item.vehicleId != vehicleId) {
                        self.map.removeOverlay(item);
                        arr.push(item);
                    }
                }
            });
            self.hideMarker = arr;
            let startIcon = new BMap.Icon(startPoint, new BMap.Size(48, 48), { //小车图片
                "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
            });

            let endIcon = new BMap.Icon(endPoint, new BMap.Size(48, 48), { //小车图片
                "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
            });
            yd.ajax({
                "url": "/apiprovince/trackplayback/getVehicleGps",
                "type": "POST",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "startTime": startTime,
                    "endTime": new Date().getTime(),
                    "querySupply": true,
                    "vehicleId": vehicleId
                },
                success(json) {
                    let points = [];
                    json.forEach((item) => {
                        let lng = item.lngAccuracy; //经度
                        let lat = item.latAccuracy; //纬度
                        let Point = new BMap.Point(lng, lat);
                        points.push(Point);
                    });
                    if (points.length == 0) { return; };
                    self.trackPolyline = new BMap.Polyline(points, {
                        "strokeColor": "#63E937",
                        "strokeWeight": 4,
                        "strokeOpacity": 1,
                        "strokeStyle": "solid"
                    });
                    self.trackStartmarker = new BMap.Marker(points[0], { "icon": startIcon });

                    // self.trackEndMarker = new BMap.Marker(points[points.length-1], {"icon": endIcon});

                    self.map.addOverlay(self.trackStartmarker);
                    self.map.addOverlay(self.trackEndMarker);
                    //创建折线
                    self.map.addOverlay(self.trackPolyline);
                }
            });
            yd.ajax({
                "url": "/apiprovince/trackplayback/queryPlanRoute",
                "type": "POST",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "startTime": startTime,
                    "endTime": new Date().getTime(),
                    "vehicleId": vehicleId
                },
                success(json) {
                    let route = [];
                    json.forEach((item) => {
                        let points = [];
                        item.gpsList.forEach((obj) => {
                            let lng = obj.lngAccuracy; //经度
                            let lat = obj.latAccuracy; //纬度
                            let Point = new BMap.Point(lng, lat);
                            points.push(Point);
                        });
                        let polyline = new BMap.Polyline(points, {
                            "strokeColor": "#00BDFF",
                            "strokeWeight": 4,
                            "strokeOpacity": 1,
                            "strokeStyle": "solid"
                        });
                        let startPoint = new BMap.Marker(points[0], { "icon": startIcon });
                        let endPoint = new BMap.Marker(points[points.length - 1], { "icon": endIcon });
                        route.push({
                            "startPoint": startPoint,
                            "endPoint": endPoint,
                            "line": polyline
                        });
                        self.map.addOverlay(startPoint);
                        self.map.addOverlay(endPoint);
                        self.map.addOverlay(polyline);
                    });
                    self.route = route;
                }
            });
        },
        clearLine() {
            const self = this;
            self.map.removeOverlay(self.trackPolyline);
            self.map.removeOverlay(self.trackStartmarker);
            // self.map.removeOverlay(self.trackEndMarker);
            self.route.forEach((item) => {
                self.map.removeOverlay(item.line);
                self.map.removeOverlay(item.startPoint);
                self.map.removeOverlay(item.endPoint);
            });
            (self.hideMarker || []).forEach((item) => {
                self.map.addOverlay(item);
            });
        },
        goAllScreen() {
            window.location.href = "http://192.1.22.1:8080/";
        },
        queryZone () {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "zoneType": 1,
                    "isConvertGps": true
                },
                success(json) {
                    const list = json.list || [];
                    list.forEach((item) => {
                        self.renderZone(item);
                    });
                }
            });
        },
        renderZone(json = {}) {
            const self = this;
            self.drawMap(json.gpsList, json.radius);
        },
        drawMap(gps, radius) {
            const self = this;
            let points = [];
            gps.forEach((item) => {
                points.push(new BMap.Point(item.lngAccuracy, item.latAccuracy));
            });
            const option = {
                "strokeColor": "#fffa50", //边线颜色。
                "strokeWeight": 4, //边线的宽度，以像素为单位。
                "strokeOpacity": 1,  //边线透明度，取值范围0 - 1。
                "fillColor": ""      //填充颜色。当参数为空时，圆形将没有填充效果。
            };
            let cover = radius ? new BMap.Circle(points[0], radius, option) : new BMap.Polygon(points, option);
            self.map.addOverlay(cover);
        }
    }
};
</script>