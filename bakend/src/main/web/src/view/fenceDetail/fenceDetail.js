import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import startPoint from "@/assets/images/sp_start.png";
import endPoint from "@/assets/images/sp_end.png";
import { mapType, rangingTool } from "_m/base";

export default {
    "name": "fenceDetail",
    "mixins": [mapType, rangingTool],
    data() {
        const self = this;
        return {
            "zoneId": 0,
            "zoneName": "",
            "zoneStatus": "",
            "documentType": "",
            "zoneType": 1,
            "fromName": "",
            "toName": ""
        };
    },
    "computed": {
        mapHeight() {
            return this.$store.state.app.contentHeight - 120;
        }
    },
    mounted() {
        const self = this;
        self.loadMap();
        let params = self.$route.query;
        self.search(params.zoneId);
    },
    "methods": {
        search(zoneId) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "data": {
                    "zoneId": zoneId,
                    "zoneType": self.zoneType,
                    "isConvertGps": true
                },
                success(json) {
                    const list = json.list || [];
                    self.render(list[0]);
                }
            });
        },
        render(json = {}) {
            const self = this;
            self.zoneId = json.zoneId || 0;
            self.zoneName = json.zoneName || "--";
            self.zoneStatus = SubConfig.fenceStatus[json.zoneStatus];
            const types = json.documentType.split(",");
            const documentType = types.map((item) => {
                return SubConfig.documentType[item] || "--";
            });
            self.documentType = documentType.join("，");
            self.fromName = json.fromName;
            self.toName = json.toName;
            self.drawMap(json.gpsList, json.radius);
        },
        loadMap() {
            const self = this;
            self.map = new BMap.Map("railMap", {
                "enableMapClick": false
            });
            let point = new BMap.Point(116.404, 39.915);
            self.map.centerAndZoom(point, 15);
            self.setDistanceToolInstance(self.map);
        },
        enableScrollWheelZoom() {
            this.map.enableScrollWheelZoom();
        },
        drawMap(gps, radius) {
            const self = this;
            self.map.clearOverlays(); // 清除覆盖物
            let points = [];
            gps.forEach((item) => {
                points.push(new BMap.Point(item.lngAccuracy, item.latAccuracy));
            });
            let cover;
            if (!self.zoneType) {
                cover = new BMap.Polyline(points, {
                    "strokeColor": "red",
                    "strokeWeight": 4,
                    "strokeOpacity": 1
                });
                let startIcon = new BMap.Icon(startPoint, new BMap.Size(48, 48), { //小车图片
                    "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                let startmarker = new BMap.Marker(points[0], {"icon": startIcon});

                let endIcon = new BMap.Icon(endPoint, new BMap.Size(48, 48), { //小车图片
                    "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                let endMarker = new BMap.Marker(points[points.length-1], {"icon": endIcon});

                self.map.addOverlay(startmarker);
                self.map.addOverlay(endMarker);
            } else {
                cover = radius ? new BMap.Circle(points[0], radius) : new BMap.Polygon(points, {
                    "strokeColor": "red",
                    "strokeWeight": 2,
                    "strokeOpacity": 0.5
                });
            }
            self.map.addOverlay(cover);
            //设置最佳缩放比
            let view = radius ? self.getCircleBestViewport(points[0], radius) : self.map.getViewport(points);
            self.map.centerAndZoom(view.center, view.zoom);
        },
        getCircleBestViewport(point, radius) {
            let zoom = 20; //地图层级数（百度地图默认为19层，这里多加1层使下面通过直径的运算刚好可以得出地图对应的层级） 
            let num = 20; //基数 
            let diameter = radius * 2; //直径
            while (num < radius) {
                num = num * 2;
                zoom--;
            }
            return {
                "center": point,
                "zoom": zoom + 2 //设置中心点和缩放层级，为了优化显示效果此处zoom多加2级
            };
        }
    }
};