import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import { mapMutations } from "vuex";
import documentTypeTreeSelect from "_c/treeSelect/documentType";
import startPoint from "@/assets/images/sp_start.png";
import endPoint from "@/assets/images/sp_end.png";
import { mapType, rangingTool } from "_m/base";

export default {
    "name": "addRoute",
    "mixins": [mapType, rangingTool],
    "components": {
        documentTypeTreeSelect
    },
    data() {
        return {
            "stepCurrent": 0,
            "startPoint": "",
            "endPoint": "",
            "routePolicy": [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS],
            "routeType": 0,
            "routeTypes": [],
            "overlays": [],
            "drawGps": [],
            "map": "",
            "textShow": false,
            "zoneName": "",
            "documentType": "",
            "timeType": "1",
            "time": "",
            "status": "1",
            "fromCode": "",
            "toCode": "",
            "fromZoneList": [],
            "toZoneList": []
        };
    },
    "watch": {},
    mounted() {
        this.loadMap();
        this.loadZoneId();
        let params = this.$route.query;
        if (params.zoneId) {
            this.zoneId = params.zoneId;
            this.loadLine(params.zoneId);
        }
    },
    "methods": {
        ...mapMutations([
            "closePage"
        ]),
        next() {
            const self = this;
            switch (this.stepCurrent) {
                case 0:
                    if (this.drawGps.length == 0) return this.$Message.error("请先添加路线！");
                    // if (this.drawGps.length>30){
                    //     this.$Modal.confirm({
                    //         "title": "警报",
                    //         "content": "对不起，您绘制的路线点数超过限制（30个点）。</br>点击“确定”系统将自动截取并进入下一步操作。</br>点击“取消”可以进行重绘操作！",
                    //         onOk () {
                    //             this.drawGps=this.drawGps.splice(0,30);
                    //             self.stepCurrent += 1;
                    //         },
                    //         onCancel () {
                    //         }
                    //     });
                    // } else {
                    // }
                    self.stepCurrent += 1;

                    break;
                case 1:
                    if (!this.routeName) {
                        return this.$Message.error("请填写路线名称！");
                    } else {
                        let namev = true;
                        yd.ajax({
                            "url": "/v1/zone/existName",
                            "type": "GET",
                            "async": false,
                            "dataType": "json",
                            "data": {"zoneName": this.routeName},
                            "success": function (data) {
                                if (data.success == false) {
                                    self.current = self.current - 1;
                                    namev = false;
                                    return self.$Message.error(data.msg);
                                }
                            }
                        });
                        if (!namev) return false;
                    }
                    if (this.alarmType == "0") {
                        if (!this.speedLimt) {
                            return this.$Message.error("请填写超速阈值！");
                        } else {
                            let regu = /^[1-9]\d*$/;
                            if (!regu.test(self.speedLimt)) {
                                return this.$Message.error("超速阈值请填写正确的数字！");
                            }
                        }
                    }
                    if (this.timeType == "0") {//按天查询逻辑
                        if (this.date[0] == "" && this.date[1] == "") {
                            this.$Message.error("请选择路线有效时间区域！");
                            return;
                        }
                        if (new Date(this.date[1]).getTime() + 28800000 - new Date().getTime() < 0) return this.$Message.error("路线有效时间不能小于当前时间！");
                    } else {
                        if (this.time[0] == "" && this.time[1] == "") {
                            this.$Message.error("请选择路线有效时间区域！");
                            return;
                        }

                    }


                    this.current += 1;
                    break;
                default:
                    break;
            }

        },
        loadMap() {
            const self = this;
            // 百度地图API功能
            self.map = new BMap.Map("map", {"enableMapClick": false});
            let poi = new BMap.Point(120.315995, 31.590394);
            self.map.centerAndZoom(poi, 16);
            self.map.enableScrollWheelZoom();
            self.setDistanceToolInstance(self.map);
        },

        searchRoute() {
            const self = this;
            if (self.startPoint == "") {
                self.$Message.error("请输入起点！");
                return;
            }
            if (self.endPoint == "") {
                self.$Message.error("请输入终点！");
                return;
            }
            self.map.clearOverlays();
            self.routeTypes = [];
            self.routeTypes = [
                {"name": "最少时间", "type": 0},
                {"name": "最短距离", "type": 1},
                {"name": "避开高速", "type": 2}
            ];
            self.changeRouteType();
            self.openDrawLine();
        },
        clearOverlays() {
            const self = this;
            if (self.overlays.length > 0) {
                for (let i in self.overlays) {
                    self.map.removeOverlay(self.overlays[i]);
                    self.overlays = [];
                }
            }
        },

        openDrawLine() {
            const self = this;
            let styleOptions = {
                "strokeColor": "red",    //边线颜色。
                "fillColor": "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                "strokeWeight": 3,       //边线的宽度，以像素为单位。
                "strokeOpacity": 0.8,	   //边线透明度，取值范围0 - 1。
                "fillOpacity": 0.6,      //填充的透明度，取值范围0 - 1。
                "strokeStyle": "solid" //边线的样式，solid或dashed。
            };
            self.clearOverlays();
            //实例化鼠标绘制工具
            self.drawingManager = new BMapLib.DrawingManager(self.map, {
                "isOpen": false, //是否开启绘制模式
                "enableDrawingTool": true, //是否显示工具栏
                "drawingToolOptions": {
                    "anchor": BMAP_ANCHOR_TOP_RIGHT, //位置
                    "offset": new BMap.Size(5, 5), //偏离值
                    "drawingModes": [
                        "polyline"
                    ]
                },
                "polylineOptions": styleOptions //线的样式

            });
            // self.textShow = true;
            // self.drawingManager.open();
            self.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
            self.drawingManager.addEventListener("overlaycomplete", function (e) {
                self.clearOverlays();
                self.drawGps = e.overlay.getPath();
                let startIcon = new BMap.Icon(startPoint, new BMap.Size(48, 48), { //小车图片
                    "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                let startmarker = new BMap.Marker(self.drawGps[0], {"icon": startIcon});

                let endIcon = new BMap.Icon(endPoint, new BMap.Size(48, 48), { //小车图片
                    "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                });
                let endMarker = new BMap.Marker(self.drawGps[self.drawGps.length-1], {"icon": endIcon});

                self.map.addOverlay(startmarker);
                self.map.addOverlay(endMarker);
                self.overlays.push(e.overlay);
            });

        },
        changeRouteType() {
            const self = this;
            let i = self.routeType;
            self.map.clearOverlays();
            let driving = new BMap.DrivingRoute(self.map,
                {
                    "renderOptions": {"map": self.map, "autoViewport": true, "panel": "r-result"},
                    "policy": self.routePolicy[i],
                    onPolylinesSet(lines) {
                        self.openDrawLine();
                    }
                });
            driving.search(self.startPoint, self.endPoint);
            setTimeout(function () {
                let lines = self.map.getOverlays();
                $.each(lines, function (i, item) {
                    if (item.ia) {
                        self.drawGps = item.getPath();
                    }
                });
            }, 1000);


        },
        goRouteManage() {
            const self = this;
            if (!self.fromCode) {
                return self.$Message.error("行驶方向起点不能为空");
            }
            if (!self.toCode) {
                return self.$Message.error("行驶方向终点不能为空");
            }
            if (!self.zoneName) {
                return self.$Message.error("路线名称不能为空");
            }
            if (!self.documentType.length) {
                return self.$Message.error("单证类型不能为空");
            }
            if (!self.time) {
                return self.$Message.error("规定时间不能为空/为0");
            }
            if (!self.status) {
                return self.$Message.error("请选择状态！");
            }
            let params = {
                "zoneType": 0,
                "width": 10,
                "zoneName": self.zoneName,
                "documentType": self.documentType.join(","),
                "zoneStatus": self.status,
                "setTime": parseInt(self.timeType) * parseInt(self.time),
                "fromCode": self.fromCode,
                "toCode": self.toCode
            };
            if (self.zoneId) {
                params.zoneId = self.zoneId;
            }
            let gpsList = [];
            for (let i in self.drawGps) {
                gpsList.push({"latAccuracy": self.drawGps[i].lat, "lngAccuracy": self.drawGps[i].lng});
            }
            params.gpsList = gpsList;

            let editurl = "/apiprovince/zone/updateRouteZoneInfo";
            let add = "/apiprovince/zone/addRouteZoneInfo";
            yd.ajax({
                "url": self.zoneId ? editurl : add,
                "type": "POST",
                "dataType": "JSON",
                "data": params,
                success(data) {
                    if (data) {
                        const route = self.$route;
                        self.$router.push({
                            "name": "routesManagement",
                            "query": {
                                "timeFlag": new Date().getTime()
                            }
                        });
                        self.closePage(route);
                    } else {
                        if (self.zoneId) {
                            self.$Message.error("保存失败！");
                        }
                    }
                }, error() {

                }
            });
        },
        loadLine(id) {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "dataType": "JSON",
                "data": {
                    "zoneId": id,
                    "zoneType": 0,
                    "isConvertGps": true
                },
                success(data) {
                    let lineMsg = data.list[0];
                    self.fromCode=lineMsg.fromCode;
                    self.toCode=lineMsg.toCode;
                    self.zoneName = lineMsg.zoneName;
                    self.documentType = lineMsg.documentType.split(",");
                    if (lineMsg.setTime % 60) {
                        self.timeType = "1";
                        self.time = lineMsg.setTime;
                    } else {
                        self.timeType = "60";
                        self.time = lineMsg.setTime / 60;
                    }
                    self.status = lineMsg.zoneStatus.toString();
                    let lineData = lineMsg.gpsList;
                    let thisGPSlist = [];
                    for (let i in lineData) {
                        thisGPSlist.push(new BMap.Point(lineData[i].lngAccuracy, lineData[i].latAccuracy));
                    }
                    let polyline = new BMap.Polyline(thisGPSlist, {
                        "strokeColor": "red",
                        "strokeWeight": 4,
                        "strokeOpacity": 1
                    });
                    let viewPort = self.map.getViewport(thisGPSlist);
                    self.map.centerAndZoom(viewPort.center, viewPort.zoom);
                    let startIcon = new BMap.Icon(startPoint, new BMap.Size(48, 48), { //小车图片
                        "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                    });
                    let startmarker = new BMap.Marker(thisGPSlist[0], {"icon": startIcon});

                    let endIcon = new BMap.Icon(endPoint, new BMap.Size(48, 48), { //小车图片
                        "anchor": new BMap.Size(24, 45) //图片的偏移量。为了是图片底部中心对准坐标点。
                    });
                    let endMarker = new BMap.Marker(thisGPSlist[thisGPSlist.length-1], {"icon": endIcon});

                    self.map.addOverlay(startmarker);
                    self.map.addOverlay(endMarker);
                    self.map.addOverlay(polyline);
                    self.drawGps = polyline.getPath();
                }, error() {
                }
            });

        },
        loadZoneId() {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "data": {
                    "zoneId": null, // 路线ID或围栏ID
                    "zoneType": 1, // 0：路线  1：围栏
                    "zoneName": null, // 路线或围栏名称
                    "documentType": null, // 单证类型
                    "zoneStatus": null,// 状态 1启用 0禁用
                    "pageNo": 1,
                    "pageSize": 100
                },
                success(json) {
                    self.fromZoneList = [];
                    const arr = [];
                    (json.list || []).forEach((item, i) => {
                        arr.push({
                            "label": item.zoneName, 
                            "value": item.zoneId
                        });
                    });
                    self.fromZoneList=arr;
                },
                error() {
                    self.fromZoneList = [];
                }
            });

        }

    }
};