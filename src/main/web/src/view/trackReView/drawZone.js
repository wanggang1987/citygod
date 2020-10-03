import * as yd from "@/libs/yd";

export default {
    "name": "drawZone",
    "methods": {
        queryZone() {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
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
                "strokeColor": "#F87A7A", //边线颜色。
                "strokeWeight": 2, //边线的宽度，以像素为单位。
                "strokeOpacity": 1, //边线透明度，取值范围0 - 1。
                "fillColor": "#fff", //填充颜色。当参数为空时，圆形将没有填充效果。
                "fillOpacity": 0.4
            };
            let cover = radius ? new BMap.Circle(points[0], radius, option) : new BMap.Polygon(points, option);
            self.map.addOverlay(cover);
        }
    }
};