import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import { mapMutations } from "vuex";
import documentTypeTreeSelect from "_c/treeSelect/documentType";
import loadingSpin from "_c/loading-spin";
import tableBase from "_m/tableBase";
import { mapType, rangingTool } from "_m/base";

let styleOptions = {
    "strokeColor": "red",    //边线颜色。
    "fillColor": "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    "strokeWeight": 3,       //边线的宽度，以像素为单位。
    "strokeOpacity": 0.8,    //边线透明度，取值范围0 - 1。
    "fillOpacity": 0.6,      //填充的透明度，取值范围0 - 1。
    "strokeStyle": "solid" //边线的样式，solid或dashed。
};

export default {
    "name": "editFence",
    "mixins": [mapType, rangingTool],
    "components": {
        documentTypeTreeSelect
    },
    data () {
        const self = this;
        return {
            "zoneId": 0,
            "zoneName": "",
            "documentType": [],
            "status": "1",
            "current": 0,
            "timeType": "minute",
            "timeTypeList": [
                {
                    "value": "minute",
                    "label": "分"
                },{
                    "value": "hour",
                    "label": "时"
                }
            ],
            "time": "",
            "model": false,
            "zone": {},
            "overlays": []
        };
    },
    "computed": {
        mapHeight () {
            return this.$store.state.app.contentHeight - 130;
        }
    },
    mounted () {
        const self = this;
        self.init();
        let params = self.$route.query;
        if (params.zoneId) {
            self.zoneId = params.zoneId;
            self.query(params.zoneId);
        }
    },
    "methods": {
        ...mapMutations([
            "closePage"
        ]),
        init () {
            const self = this;
            
            // 百度地图API功能
            self.map = new BMap.Map("map" ,{
                "enableMapClick": false
            });
            let poi = new BMap.Point(120.315995,31.590394);
            self.map.centerAndZoom(poi, 16);
            self.map.enableScrollWheelZoom();
            self.setDistanceToolInstance(self.map);
            self.overlays = [];
            self.drawingManager(); // 实例化鼠标绘制工具
            
            self.loadMapAutocomplete();
        },
        //实例化鼠标绘制工具
        drawingManager () {
            const self = this;
            let drawingManager = new BMapLib.DrawingManager(self.map, {
                "isOpen": false, //是否开启绘制模式
                "enableDrawingTool": true, //是否显示工具栏
                "drawingToolOptions": {
                    "anchor": 1, //BMAP_ANCHOR_TOP_RIGHT 位置
                    "offset": new BMap.Size(5, 5), //偏离值
                    "drawingModes": [
                        "polygon", // BMAP_DRAWING_POLYGON
                        "circle" // BMAP_DRAWING_CIRCLE
                        // "rectangle" // BMAP_DRAWING_RECTANGLE
                    ]
                },
                "circleOptions": styleOptions, //圆的样式
                "polygonOptions": styleOptions, //多边形的样式
                "rectangleOptions": styleOptions //矩形的样式
            });  

            //添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener("overlaycomplete", self.overlaycomplete);
        },
        //鼠标绘制完成回调方法   获取各个点的经纬度
        overlaycomplete (e) {
            const self = this;
            self.clearAll(self.overlays);//绘制完成先清理
            self.overlays.push(e.overlay);  
            let zone = {};
            let paths = [];
            if (e.drawingMode == "circle") { //画圆
                zone = {
                    "type": 8,
                    "radius": e.overlay.getRadius()
                };
                paths = self.getGps([e.overlay.getCenter()]);
            } else if (e.drawingMode == "polygon") { //画多边形
                zone = {
                    "type": 9
                };
                paths = self.getGps(e.overlay.getPath());
            } else if (e.drawingMode == "rectangle") { //画矩形
                zone={
                    "type": 7
                };
                paths = self.getGps(e.overlay.getPath());
            }
            Promise.all(paths).then((gps) => {
                self.zone = {
                    ...zone,
                    "gps": zone.type == 8 ? gps :[...gps, gps[0]]
                };
            });
        },
        clearAll (overlays) {
            overlays.forEach((item) => {
                this.map.removeOverlay(item);
            });
        },
        offsetCorrection (gps){
            return new Promise((resolve, reject) => {
                let pointArr=[];
                pointArr.push(new BMap.Point(gps.longitude, gps.latitude));
                let convertor = new BMap.Convertor();
                convertor.translate(pointArr, 1, 5, (data) => {
                    if (data.status === 0) {
                        resolve({
                            "lngAccuracy": gps.longitude,
                            "latAccuracy": gps.latitude
                        });
                    }
                });
            });
        },
        getGps (paths) {
            let arr = [];
            paths.forEach((item, i) => {
                arr.push(this.offsetCorrection({
                    "longitude": item.lng,
                    "latitude": item.lat
                }));
            });
            return arr;
        },
        loadMapAutocomplete (mySuggestId) {
            const self = this;
            //建立一个自动完成的对象
            const ac = new BMap.Autocomplete({
                "input": "cityMap",
                "location": self.map
            });
            const onconfirm = (e) => {
                //鼠标点击下拉列表后的事件
                let _value = e.item.value;
                const keys = ["province", "city", "district", "street", "business"];
                let str = "";
                let curVal = ""; // 当前有效值
                keys.forEach((key) => {
                    const val = _value[key];
                    // 如果当前字段和已拼接字段不一样并且和上一个有效字段不一致则拼接
                    if (str != val && curVal != val) str += _value[key];
                    if (val) curVal = val; // 存储不为空的当前字段
                });
                document.getElementById("cityMap").value = str;// 强制更新输入框的值
                self.setPlace(str);
            };
            ac.removeEventListener("onconfirm", onconfirm);
            ac.addEventListener("onconfirm", onconfirm);
        },
        setPlace (value) {
            const self = this;
            const local = new BMap.LocalSearch(self.map, { //智能搜索
                "onSearchComplete": () => {
                    let point = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    self.map.centerAndZoom(point, 18);
                    // self.map.addOverlay(new BMap.Marker(pp));    //添加标注
                }
            });
            local.search(value);
        },
        back () {
            this.current = 0;
        },
        next () {
            if (!this.zone.type) return this.$Message.error("请先添加绘制围栏！");
            this.current += 1;
        },
        save () {
            const self = this;
            if (!self.zoneName) return self.$Message.error("请填写围栏名称！");
            if (!self.documentType.length) return self.$Message.error("请选择单证类型！");
            let params = {
                "zoneId": self.zoneId || null,
                "zoneType": 1,
                "radius": self.zone.radius || null,
                "zoneName": self.zoneName,
                "documentType": self.documentType.toString(),
                "zoneStatus": self.status,
                "gpsList": self.zone.gps
            };
            let url = self.zoneId ? "../apiprovince/zone/updateFenceCircleZoneInfo" : "../apiprovince/zone/addFenceCircleZoneInfo";
            if (self.zone.type != 8) {
                url = self.zoneId ? "../apiprovince/zone/updateFencePolygonZoneInfo" : "../apiprovince/zone/addFencePolygonZoneInfo";
            }
            yd.ajax({
                "url": url,
                "type": "POST",
                "data": params,
                success (json) {
                    if (json) {
                        self.id = json;
                        self.$Message.success("保存成功！");
                        const route = self.$route;
                        self.$router.push({
                            "name": "manageFence",
                            "query": {
                                "tag": new Date().getTime()  // 触发页面刷新
                            }
                        });
                        self.closePage(route);
                        
                    } else {
                        self.$Message.error("保存失败！");
                    }
                },
                error () {
                    self.$Message.error("保存失败！");
                }
            });
        },
        clickMap (e) {
            const el = e.target;
            if (el.className && typeof el.className === "string" && el.className.indexOf("BMapLib_box") != -1) {
                this.model = el.getAttribute("drawingtype") == "polygon";
            }
        },
        query (zoneId) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/zone/queryZoneInfoList",
                "type": "POST",
                "data": {
                    "zoneId": zoneId,
                    "zoneType": 1,
                    "isConvertGps": true
                },
                success (json) {
                    const list = json.list || [];
                    self.render(list[0]);
                }
            });
        },
        render (json = {}) {
            const self = this;
            self.zoneId = json.zoneId || 0;
            self.zoneName = json.zoneName || "--";
            self.status = json.zoneStatus.toString() || "1";
            self.documentType = json.documentType || [];
            self.zone = {
                "type": json.radius ? 8 : 9,
                "radius": json.radius || null,
                "gps": json.gpsList
            };
            self.drawMap(json.gpsList, json.radius);
        },
        drawMap (gps, radius) {
            const self = this;
            self.map.clearOverlays(); // 清除覆盖物
            let points=[];
            gps.forEach((item) => {
                points.push(new BMap.Point(item.lngAccuracy, item.latAccuracy));
            });
            let cover = radius ? new BMap.Circle(points[0], radius, styleOptions) : new BMap.Polygon(points, styleOptions);
            self.overlays = [cover]; // 存储覆盖物信息以用于编辑时移除
            self.map.addOverlay(cover);
            //设置最佳缩放比
            let view = radius ? self.getCircleBestViewport(points[0], radius) : self.map.getViewport(points);
            self.map.centerAndZoom(view.center, view.zoom);
        },
        getCircleBestViewport (point, radius) { 
            let zoom = 20; //地图层级数（百度地图默认为19层，这里多加1层使下面通过直径的运算刚好可以得出地图对应的层级） 
            let num = 20; //基数 
            let diameter = radius *2; //直径 
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