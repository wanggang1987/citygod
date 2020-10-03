import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import treeSelector from "_c/select-vehicle-tree";
import loadingSpin from "_c/loading-spin";
import picGroupFixPlayer from "_c/picGroupFixPlayer";
import trackPrevImg from "@/assets/images/trackReview/track-prev.png";
import trackNextImg from "@/assets/images/trackReview/track-next.png";
import trackPauseImg from "@/assets/images/trackReview/track-pause.png";
import trackPlayImg from "@/assets/images/trackReview/track-play.png";
import trackImg from "@/assets/images/trackReview/track.png";
import routeImg from "@/assets/images/trackReview/route.png";
import makeUpImg from "@/assets/images/trackReview/makeUp.png";
import setMapStyle from "_m/setMapStyle";
import { mapType, rangingTool } from "_m/base";
import vehicleGpsData from "./vehicleGpsData";
import alarmTable from "./alarmTable";
import drawZone from "./drawZone";

function ComplexCustomOverlay(point, text) {
    this._point = point;
    this.text = text;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map) {
    this._map = map;
    let div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.id = "diyInfowindow";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#FFF";
    div.style.border = "1px solid #FFF";
    div.style.borderRadius = "4px";
    div.style.color = "#333";
    div.style.padding = "10px";
    div.style.lineHeight = "18px";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px";
    div.style.boxShadow = "3px 3px 16px rgba(0,0,0,0.5)";
    div.style.width = "255px";
    let span = this._span = document.createElement("span");
    div.appendChild(span);
    let that = this;
    let arrow = this._arrow = document.createElement("div");
    arrow.style.position = "absolute";
    arrow.style.width = "16px";
    arrow.style.height = "20px";
    arrow.style.bottom = "-12px";
    arrow.style.left = "5px";
    arrow.style.overflow = "hidden";
    arrow.id = "arrow";
    let icon = document.createElement("i");
    icon.className = "ivu-icon ivu-icon-md-arrow-dropdown";
    icon.style.fontSize = "31px";
    icon.style.color = "#FFF";
    icon.style.position = "relative";
    icon.style.top = "-3px";
    icon.style.left = "-9px";
    arrow.appendChild(icon);
    div.appendChild(arrow);
    div.getElementsByTagName("span")[0].innerHTML = this.text;
    this._map.getPanes().labelPane.appendChild(div);
    return div;
};
ComplexCustomOverlay.prototype.draw = function() {
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - (document.getElementById("diyInfowindow").offsetHeight + 17) + "px";
};


function ComplexCustomMarker(point, text, mouseoverText, alarmMsg, self) {
    this._point = point;
    this._text = text;
    this._overText = mouseoverText;
    this._alarmMsg = alarmMsg;
    this._self = self;
}
ComplexCustomMarker.prototype = new BMap.Overlay();
ComplexCustomMarker.prototype.initialize = function(map) {
    this._map = map;
    let div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.height = "24px";
    div.style.padding = "2px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px";
    let span = this._span = document.createElement("span");
    div.appendChild(span);
    span.appendChild(document.createTextNode(this._text));
    let that = this;
    let arrow = this._arrow = document.createElement("div");
    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
    arrow.style.position = "absolute";
    arrow.style.width = "11px";
    arrow.style.height = "10px";
    arrow.style.top = "22px";
    arrow.style.left = "10px";
    arrow.style.overflow = "hidden";
    div.appendChild(arrow);
    div.onmouseover = function() {
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#0000ff";
        this.getElementsByTagName("span")[0].innerHTML = that._overText;
        arrow.style.backgroundPosition = "0px -20px";
    };

    div.onmouseout = function() {
        this.style.backgroundColor = "#EE5D5B";
        this.style.borderColor = "#BC3B3A";
        this.getElementsByTagName("span")[0].innerHTML = that._text;
        arrow.style.backgroundPosition = "0px 0px";
    };
    div.onclick = function() {
        that._self.showAlarmDetial = true;
        that._alarmMsg.alarmTypeText=SubConfig.alarmType[that._alarmMsg.alarmType];
        that._alarmMsg.color=SubConfig.plateColor[that._alarmMsg.plateColor];
        that._self.alarmDetail = that._alarmMsg;
        let data = that._alarmMsg;
        yd.getLocation({
            "lng": data.gpsLng,
            "lat": data.gpsLat
        },
        function(address) {
            data.address = address || "此位置无法解析";
            // Vue.set(that._alarmMsg,"address",address);
            $(".analysisAddressmodel:eq(0)").html(data.address);
        });

    };

    this._map.getPanes().labelPane.appendChild(div);
    return div;
};
ComplexCustomMarker.prototype.draw = function() {
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
};

export default {
    "name": "trackReView",
    "mixins": [setMapStyle, drawZone, mapType, rangingTool],
    "components": {
        "tree-selector": treeSelector,
        "loading-spining": loadingSpin,
        "vehicleGpsData": vehicleGpsData,
        "alarmTable": alarmTable,
        "picGroupFixPlayer": picGroupFixPlayer
    },
    "data": function() {
        let _this = this;
        //精确到999毫秒的兼容火狐写法
        // let time=new Date(new Date(new Date().Format("yyyy/MM/dd 23:59:59")).getTime()+999);
        return {
            "trackPrevImg": trackPrevImg,
            "trackNextImg": trackNextImg,
            "trackPauseImg": trackPauseImg,
            "trackPlayImg": trackPlayImg,
            "trackImg": trackImg,
            "makeUpImg": makeUpImg,
            "routeImg": routeImg,
            "tableShow": true,
            //控制刷新表格高度的
            "showAlarmDetial": false,
            "alarmDetail": {
                "startGpsStatus": 0
            },
            "statistical": {
                "activeSafety": 0,
                //违规
                "driveMonitoring": 0,
                //安全
                "conventional": 0,
                //事故
                "drivingDuration": 0,
                //行驶时长
                "avgSpeed": 0 //平均速度
            },
            "current": {
                "activeSafety": 0,
                //违规
                "driveMonitoring": 0,
                //安全
                "conventional": 0 //事故
            },
            //报警树统计
            "allAlarmData": [],
            //所有报警信息
            /* 独立 三个表格（轨迹点 停留点 事件点）的查询时间*/
            "searchTableStartTime": "",
            "searchTableEndTime": "",
            "searchTableStartTime2": "",
            "searchTableEndTime2": "",
            "legend": [
                {
                    "name": "轨迹点",
                    "color": "#00A854"
                },{
                    "name": "漂移点",
                    "color": "#F04134"
                },{
                    "name": "补传数据",
                    "color": "#008FEF"
                }
            ],
            "retransmittedFlag": true,
            //是否展示补传数据
            "todayAlarm1FlagOne": false,
            "todayAlarm1FlagTwo": false,
            "vehicleId": "",
            "defaultVehicleIds": [],
            "endTime": new Date(),
            "startTime": new Date(new Date().Format("yyyy/MM/dd 00:00:00")),
            "calendarDate": new Date(),
            "mileageTotal": 0,
            "timeTotal": "",
            "calendarList": [],
            "hasGpsDay": [],
            "map": "",
            "searchCurrentStartTime": 0,
            //大于8小时查询轨迹开始时间
            "searchCurrentStartTime2": 0,
            //大于8小时查询报警开始时间
            "Points": [],
            "gpsAllData": [],
            "spinShow": false,
            "playCurrMileage": 0,
            //播放条下面得当前里程
            "playCurrTime": 0,
            //播放条下面得当前时间
            "playAllTime": 0,
            //播放条下面得当前时间
            "playSpeed": "1",
            "playPercent": 0,
            //播放当前的进度  （下标/总数）
            "playCurrGpsI": 0,
            //播放当前的下标
            "carMK": "",
            "playflag": false,
            "infowindow": "",
            //过滤默认时间
            "StartTimeFilterSecond": 300,
            //滚动的数据
            "sortStopStartTime": "",
            "sortStopTime": "",
            "sortStopEndTime": "",
            "timeOrderType": "",
            "speedOrderType": "",
            //轨迹点车速排序
            "startTimeDirect": "",
            "startSpeedDirect": "",
            "columnsStop": [
                {
                    "title": "序号",
                    "type": "index",
                    "width": 80,
                    "className": "rowShow"
                },{
                    "title": "车牌号",
                    "key": "carLicense",
                    "width": 180,
                    "render": (h, params) => {
                        return h("div", [h("span", {
                            "style": {
                                "display": "inline-block",
                                "margin-right": "13px"

                            }
                        },
                        params.row.carLicense), h("span", {},
                            SubConfig.plateColor[_this.plateColor])]);
                    }
                },{
                    "title": "驾驶员",
                    "key": "driverName",
                    "width": 120,
                    "render": (h, params) => {
                        return params.row.driverName == null ? "--": params.row.driverName;
                    }
                },{
                    "title": "停留开始时间",
                    "key": "startTime",
                    "sortable": "custom",
                    "width": 180,
                    "render": (h, params) => {
                        return new Date(params.row.startTime).Format("yyyy-MM-dd hh:mm:ss");
                    }
                },{
                    "title": "停车结束时间",
                    "key": "endTime",
                    "sortable": "custom",
                    "width": 180,
                    "render": (h, params) => {
                        return new Date(params.row.endTime).Format("yyyy-MM-dd hh:mm:ss");
                    }
                },{
                    "title": "停车时长",
                    "key": "durationTime",
                    "width": 180,
                    "sortable": "custom",
                    "className": "rowShow"
                },{
                    "title": "停车位置",
                    "key": "site",
                    "minWidth": 180,
                    "className": "rowShow"
                }
            ],
            "dataTarck": [],
            //轨迹点数组
            "arrStop": [],
            //停留点数组
            "dataIncident": [],
            //停留点数组
            "isFlag": false,
            "pageNo": 1,
            "alarmPageNo": 1,
            //弹出框的标志
            "pointBox": false,
            //解析的地址
            "site": "",
            "imgs": [],
            "videos": [],
            "tabName": "tabName2",
            //是否点击过滤的标志
            "isFiltr": false,
            "dockingStations": [],
            "alarmInformation": "",
            //报警证据数据
            "address": "",
            "flagDate": "",
            //我的结束
            "scrollLeft": 0,
            "eventPointsScrloo": true,
            "eventPointsHeight": 0,
            "tableHeight": 0,//表格高度
            "supplys": [],
            //补偿点
            "drafts": [],
            //漂移点
            "createMeasurePloneTool": "",
            "showIcon": false,
            "type": 3,
            "indeterminate": false,
            // "checkAll": true,
            // "checkAllGroup": ["1", "2", "3"],
            "formatter": function(val) {
                return parseInt(val);
            },
            "searchClick": false,
            "alarmClick": false,
            "alarm2Click": false,
            "picShow": false,
            "picData": [],
            "num40001": 0,
            "markers": [] // 储存覆盖物
        };
    },
    "watch": {
        "playSpeed": function() {
            if (this.playflag) {
                clearInterval(this.timeri);
                this.play();
            }
        },
        "searchCurrentStartTime": function(val) {
            if (val == 0) {
                this.spinShow = false;
            } else {
                this.spinShow = true;
            }
        },
        "tabName": function(tabName) {
            if (tabName == "tabName1") {
                if (!this.isSearch()) return;
                if (this.arrStop.length == 0) this.querystopdetaildata(this);
            }
            if (tabName == "tabName2") {
                this.searchClick=true;

            }
            if (tabName == "tabName3") {
                this.alarmClick=true;
            } if (tabName == "tabName4") {
                this.alarm2Click=true;
            }
        },
        "scrollLeft": function() {
            this.eventPointsScrloo = false;
        },
        "eventPointsHeight": function() {
            this.eventPointsScrloo = true;
        },
        "vehicleId": function () {
            if (this.vehicleId){
                this.getIsExistGps(this.calendarDate);
            }
        }
    },
    created () {
        const self = this;
        const params = self.$route.query;
        if (params.vehicleId) {
            self.vehicleId = parseInt(params.vehicleId);
        }
        if (params.startTime) {
            const startTime = parseInt(params.startTime);
            self.startTime = new Date(startTime);
            if (params.endTime) self.endTime = new Date(Math.min(startTime + 604800000, parseInt(params.endTime))); // 开始结束时间差大于7天时，结束时间取开始时间加7天
        } 
         
    },
    mounted () {
        const self = this;
        self.loadMap();
        self.timeTotal = self.endTime.getTime() - self.startTime.getTime();
        self.getCalendarList(self.calendarDate);
        self.reSizeHeightBox();

        $(document).on("click", ".ivu-tree-title", function() {
            $(".ivu-tree-title").removeClass("ivu-tree-title-selected");
            $(this).addClass("ivu-tree-title-selected");
        });
        $(".asideBottom .ivu-table th").removeClass("rowShow");
        $(document).on("click", "#map", function() {
            self.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            self.map.enableAutoResize();
        });
        $(document).on("mouseleave", "#map", function() {
            self.map.disableScrollWheelZoom(true); //开启鼠标滚轮缩放
        });

        /*
         以下方法用于修复鼠标滚轮放大缩小地图时造成的自定义覆盖物（车辆信息框）的位置校准
         */
        window.canAutoScroll = true;
        //只要滚动事件发生，就停止自动滚动定位方法的执行
        let timeout = null;
        $(document).on("mousewheel", "#map", function(e) {
            if (timeout != null) {
                window.clearTimeout(timeout);
            }
            window.canAutoScroll = false;
            timeout = setTimeout(() => {
                self.map.panBy(0, 0);
            },
            100);
        });
        self.autoHight();

        window.onresize = function() {
            self.map.panBy(0, 0);
        };
        self.queryZone(); // 加载围栏信息
    },
    "methods": {
        reSizeHeightBox(){
            let self=this;
            let oBox=document.getElementById("divTable");
            let X="";
            let Y="";
            //当鼠标点击盒子的时候触发 执行右边的函数   ev形参  向浏览器返回当前值 FireFox火狐 Chrome谷歌默认都是有一个值传进来的
            oBox.onmousedown=function (ev) {
                //兼容IE和FireFox Chrome 只要一个为真就可以执行
                let iEvent = ev || event;
                //将盒子点击时获取的宽度赋值给W
                let W = oBox.offsetWidth;
                //将盒子点击时获取的宽度赋值给H
                let H = oBox.offsetHeight;
                //将盒子点击时获取的鼠标X轴的值赋值给disX
                let disX = iEvent.clientX;
                //将盒子点击时获取的鼠标Y轴的值赋值给disY
                let disY = iEvent.clientY;
                //将盒子的鼠标点击时的距离左边的距离和盒子的宽度总和 赋值给disW
                let disxW = oBox.offsetLeft + W;
                //将盒子的鼠标点击时的距离头部的距离和盒子的高度总和 赋值给dis
                let disyH = oBox.offsetTop + H;

                //这是判断是否当前点击的是盒子的四周
                //当盒子当前点击X轴的值大于 盒子的距离左边的值加盒子自身的宽度减去10像素时  就是表示已经点击到了盒子的右边框
                // if (iEvent.clientX > oBox.offsetLeft + oBox.offsetWidth - 10) {
                //     //alert('碰到了盒子的右边！');
                //     //赋予上面X的值这时等于right  好用于下面的对比
                //     // X = 'right';
                //     // oBox.style.cursor = 'e-resize';
                // }
                // //当盒子当前点击X轴的值小于 盒子的距离左边的值10像素时  就是表示已经点击到了盒子的左边框
                // if (iEvent.clientX < oBox.offsetLeft + 10) {
                //     //alert('碰到了盒子的左边！');
                //     //赋予上面X的值这时等于left  好用于下面的对比
                //     // X = 'left';
                //     // oBox.style.cursor = 'e-resize';
                // }

                if (iEvent.clientY < oBox.offsetTop + 110) {
                    Y = "top";
                } //底端判断和顶部判断同上
                // else if (iEvent.clientY > oBox.offsetTop + oBox.offsetHeight - 10) {
                //     //alert('你碰到了盒子的底部！');
                //     Y = 'bottom';
                //     oBox.style.cursor = 's-resize';
                // }

                //当鼠标每移动一个像素点之时 触发 执行右边的函数  在事件前加document 是为了加大事件的作用域 移动时对整个页面文档有效
                document.onmousemove = function (ev) {
                    let iEvent = ev || event; //当当前的鼠标值减去之前获取的鼠标值为正数 那么正数加正数是增大
                    oBox.style.height = H - (iEvent.clientY - disY) + "px";
                    oBox.style.top = disyH - oBox.offsetHeight + "px";
                    self.autoHight();
                };
                //当拖动结束后 我们需要释放鼠标 添加鼠标按下松开事件 onmouseup 让鼠标点击不松 的事件为空 让鼠标每移动
                document.onmouseup = function () {
                    document.onmousedown = null;
                    document.onmousemove = null;//一像素的触发的事件为空
                };
            };
        },
        "hideTable": function () {
            this.myCompOverlay.hide();
        },
        /*"searchTable": function (day) {
            const self = this;
            self.flagDate = day.date;
            self.searchTableStartTime = new Date(new Date(day.date).Format("yyyy/MM/dd") + " 00:00:00");
            self.searchTableEndTime = new Date(new Date(day.date).Format("yyyy/MM/dd") + " 23:59:59");

            self.searchTableStartTime2 = new Date(new Date(day.date).Format("yyyy/MM/dd") + " 00:00:00");
            self.searchTableEndTime2 = new Date(new Date(day.date).Format("yyyy/MM/dd") + " 23:59:59");
            self.map.clearOverlays();
            self.map.centerAndZoom(new BMap.Point(116.404, 39.915), 6); // 初始化地图,设置中心点坐标和地图级别
            delete self.myCompOverlay;
            self.Points = [];
            self.playCurrGpsI = 0;
            self.gpsAllData = [];

            self.playflag = false;
            self.playCurrMileage = 0; //播放条下面得当前里程
            self.playCurrTime = 0; //播放条下面得当前时间
            self.playAllTime = 0; //播放条下面得当前时间
            self.playSpeed = "1";
            self.mileageTotal = 0; //公里程
            self.playPercent = 0; //播放当前的进度  （下标/总数）
            self.playCurrGpsI = 0; //播放当前的下标
            self.carMK = "";
            self.pageNo = 1;
            self.alarmPageNo = 1;
            self.dataTarck = [];
            self.arrStop = [];
            self.dataIncident = [];
            self.allAlarmData = [];
            self.querystopdetaildata(this);
            self.getVehicleGps.call(this);
        },*/
        "selectChange": function (data) {
            this.vehicleId = data.id;
            this.carLicense = data.carLicense;
            this.color = data.color;
            this.companyName = data.companyName;
        },
        //根据开始时间重新加载日历
        "startTimeChange": function () {
            const self = this;
            let time = self.startTime.getTime();
            this.getCalendarList(new Date(time));
        },

        "clear": function () {
            const self = this;
            self.clearOverlays();

            self.map.centerAndZoom(new BMap.Point(120.408799, 31.540674), 15); // 初始化地图,设置中心点坐标和地图级别
            delete self.myCompOverlay;
            self.Points = [];
            self.playCurrGpsI = 0;
            self.gpsAllData = [];
            self.playflag = false;
            self.showAlarmDetial = false;
            self.playCurrMileage = 0; //播放条下面得当前里程
            self.playCurrTime = 0; //播放条下面得当前时间
            self.playAllTime = 0; //播放条下面得当前时间
            self.playSpeed = "1";
            self.mileageTotal = 0; //公里程
            self.playPercent = 0; //播放当前的进度  （下标/总数）
            self.playCurrGpsI = 0; //播放当前的下标
            self.carMK = "";
            /*重置查询时间为三个表格的查询时间*/
            self.searchTableStartTime = self.startTime;
            self.searchTableEndTime = self.endTime;
            self.searchTableStartTime2 = self.startTime;
            self.searchTableEndTime2 = self.endTime;
            clearInterval(self.timeri);
            this.tabName = "tabName2";
            self.arrStop = []; //停留点数据
            self.dataIncident = []; //异常点数据
            self.supplys = []; //补偿点
            self.drafts = []; //漂移点
            self.allAlarmData = []; // 报警点数组
        },
        "loadMap": function () {
            const self = this;
            // 百度地图API功能
            self.map = new BMap.Map("map", {
                "enableMapClick": false
            }); // 创建Map实例
            //添加地图类型控件
            // self.map.enableScrollWheelZoom();//启用地滚轮缩放 默认不开启
            self.map.centerAndZoom(new BMap.Point(120.408799, 31.540674), 15); // 初始化地图,设置中心点坐标和地图级别
            self.setMapStyle(self.map);
            self.setDistanceToolInstance(self.map);
        },
        search () {
            //点击查询将tab置为第一栏
            let _this = this;
            _this.plateColor = _this.plateColorConpy;

            if (_this.isSearch() == false) return;
            _this.clear();
            // 点击查询
            _this.getVehicleGps.call(this);
            //点击查询清空值
            _this.initInfo();
            // 轨迹点查询
            // _this.querystopdetaildata(this); //停留点
            this.searchClick=true;
            this.pointBox = false;
        },
        "initInfo": function () {
            this.dataTarck = [];
            this.dataIncident = [];
            this.pageNo = 1;
            this.alarmPageNo = 1;
            //点击搜索重置过滤标志
            this.isFiltr = false;
        },
        //判断查询参数有无异常
        "isSearch": function () {
            if (this.vehicleId == "" || this.vehicleId == undefined) {
                this.$Message.error("请选择车辆!");
                return false;
            }
            if (this.startTime == "") {
                this.$Message.error("请选择查询开始时间或者结束时间");
                return false;
            }
            if (this.endTime == "") {
                this.$Message.error("请选择查询开始时间或者结束时间");
                return false;
            }
            if (this.startTime.getTime() > new Date().getTime()) {
                this.startTime = new Date();
            }
            if (this.endTime.getTime() > new Date().getTime()) {
                this.endTime = new Date();
            }
            if (this.startTime.getTime() > this.endTime.getTime()) {
                this.$Message.error("开始时间不能大于结束时间!");
            }

            let timeTotal = this.endTime.getTime() - this.startTime.getTime();
            if (timeTotal > 3600*1000*24*7-1) {
                this.$Message.error("您不能查询超过7天的数据！请调整后再试");
                return false;
            } else if (timeTotal <= 3600*1000*24*7-1) {
                this.isFlag = true;
                this.timeTotal = timeTotal;
            }
            return true;

        },
        //停留点排序方法
        "sortStop": function (sortData) {
            if (!this.isSearch()) return;
            this.arrStop = [];
            this.sortStopStartTime = "";
            this.sortStopTime = "";
            this.sortStopEndTime = "";
            if (sortData.key == "startTime") {
                if (sortData.order == "asc") {
                    this.sortStopStartTime = "ASC";
                }
                if (sortData.order == "desc") {
                    this.sortStopStartTime = "DESC";
                }
                if (sortData.order == "normal") {
                    this.sortStopStartTime = "";
                }
            }
            if (sortData.key == "durationTime") {
                if (sortData.order == "asc") {
                    this.sortStopTime = "ASC";
                }
                if (sortData.order == "desc") {
                    this.sortStopTime = "DESC";
                }
                if (sortData.order == "normal") {
                    this.sortStopTime = "";
                }
            }
            if (sortData.key == "endTime") {
                if (sortData.order == "asc") {
                    this.sortStopEndTime = "ASC";
                }
                if (sortData.order == "desc") {
                    this.sortStopEndTime = "DESC";
                }
                if (sortData.order == "normal") {
                    this.sortStopEndTime = "";
                }
            }
            this.querystopdetaildata(this);

        },
        //停车点弹框展示
        "rowClick": function (rowClick) {
            let site = {
                "lat": rowClick.latAccuracy,
                "lng": rowClick.lngAccuracy
            };
            this.analysisAddress(this, site, rowClick);
        },
        //停车点地图展示小窗口
        "analysisAddress": function (_this, dot, rowClick) {
            let lat = dot.lat;
            let lng = dot.lng;
            let defineUrl = "https://api.map.baidu.com/geocoder/v2/?location=" + lat + "," + lng + "&output=json&ak=VXzGVxtAHNMXt3rc7BxpfjF4AhT1vNIT&pois=0&s=1";
            $.ajax({
                "type": "GET",
                "url": defineUrl,
                "dataType": "JSONP",
                "async": false,
                success (data) {
                    if (data.status == 0) {
                        let add = data.result.formatted_address + data.result.sematic_description;
                        if (add == "") {
                            add = "此地址无法解析";
                        }
                        let opts = {
                            "width": 250,
                            // 信息窗口宽度
                            "height": 180 // 信息窗口高度// 信息窗口标题
                        };
                        rowClick.lngAccuracy = rowClick.lngAccuracy + "";
                        rowClick.latAccuracy = rowClick.latAccuracy + "";
                        let gpsPoint = new BMap.Point(rowClick.lngAccuracy, rowClick.latAccuracy);
                        let infoWindowShow = "<table>" + "<tr><td width=\"80\">开始时间：</td><td>" + new Date(rowClick.startTime).Format("yyyy-MM-dd hh:mm:ss") + "</td></tr>" +
                            "<tr><td>结束时间：</td><td>" + new Date(rowClick.endTime).Format("yyyy-MM-dd hh:mm:ss") + "<td></tr>" +
                            "<tr><td>停留时长：</td><td>" + rowClick.durationTime + "<td></tr>" +
                            "<tr><td>卫星定位位置：</td><td>" + rowClick.lngAccuracy.substring(0, 10) + "," + rowClick.latAccuracy.substring(0, 10) + "<td></tr>" +
                            "<tr><td>地址：</td><td style=\"letter-spacing:2px\">" + add + "</td></tr></table>";
                        let infoWindow = new BMap.InfoWindow(infoWindowShow, opts);
                        _this.map.openInfoWindow(infoWindow, gpsPoint);
                    }
                },
                error (data) {
                }
            });
        },
        "getVehicle": function (vehicle) {
            const self = this;
            self.vehicleId = vehicle.id;
        },
        //日历上个月
        "prevMonth": function () {
            const self = this;
            let month = self.calendarDate.getMonth();
            if (month) {
                self.calendarDate.setMonth(month - 1);
            } else {
                self.calendarDate.setFullYear(self.calendarDate.getFullYear() - 1);
                self.calendarDate.setMonth(11);
            }
            if (this.vehicleId){
                this.getIsExistGps(self.calendarDate);
            } else {
                this.getCalendarList(self.calendarDate);
            }
        },
        //日历下个个月
        "nextMonth": function () {
            const self = this;
            let month = self.calendarDate.getMonth();
            if (month <= 10) {
                self.calendarDate.setMonth(month + 1);
            } else {
                self.calendarDate.setFullYear(self.calendarDate.getFullYear() + 1);
                self.calendarDate.setMonth(0);
            }
            if (this.vehicleId){
                this.getIsExistGps(self.calendarDate);
            } else {
                this.getCalendarList(self.calendarDate);
            }

        },
        //生成日历
        "getCalendarList": function (date) {
            const self = this;
            // let date = date;
            self.calendarDate = date;
            let calendarList = [];
            let dateFormat = date.Format("yyyy-MM");
            let startDate = new Date(dateFormat); //开始时间
            let startMonth = startDate.getMonth(); //开始月份
            startDate.setMonth(startMonth);
            let month = startDate.Format("yyyy-MM");
            calendarList.unshift({
                "month": month,
                "curYear": month.split("-")[0],
                "curMonth": month.split("-")[1],
                "dates": self.calendar({
                    "month": month
                })
            });
            self.calendarList = calendarList;
        },
        "calendar": function (data) {
            const self = this;
            let curMonth = parseInt(data.month.split("-")[1]);
            let calendar = [[], [], [], [], [], []];
            let startDate = new Date(data.month);
            let startDay = startDate.getDay(); //获取当月第一天是周几
            for (let i = -startDay,
                len = (42 - startDay), num = 0; i < len; i++) {
                let date = new Date(data.month);
                date.setDate(i + 1);
                let week = date.getDay();
                calendar[num][week % 7] = {
                    "date": date,
                    "active": false,
                    "isGps": self.hasGpsDay.indexOf(date.Format("yyyy-MM-dd")) != -1 ? true : false
                };
                if (week % 7 == 6) num++;
            }
            return calendar;
        },
        // 播放
        "play": function () {
            const self = this;
            if (self.Points.length == 0) {
                self.$Message.error("对不起，您尚未查询轨迹，请查询后再试！");
                return;
            }
            self.playflag = true;

            if (self.playCurrGpsI == (self.Points.length - 1)) {
                self.playCurrGpsI = 0;
                self.playSetVal(self.playCurrGpsI);
                self.queryVehicleBasicInfo.call(this, self.gpsAllData[0].time);
            } else if (self.playCurrGpsI == 0) {
                self.queryVehicleBasicInfo.call(this, self.gpsAllData[0].time);
            }
            self.timeri = setInterval(function () {
                let i = (self.playCurrGpsI += 1);
                //停止逻辑
                if (i > (self.Points.length - 1)) {
                    i = (self.Points.length - 1);
                    self.playCurrGpsI = i;
                    self.pause();
                }
                self.playSetVal(i);

            },
            1000 / parseInt(self.playSpeed));
        },
        "playSetVal": function (i) {
            const self = this;
            if (i == self.gpsAllData.length) {
                return;
            }
            if (self.gpsAllData.length < 300) {
                self.playPercent = Math.ceil(i / self.gpsAllData.length * 100);
            } else {
                self.playPercent = Math.floor(i / self.gpsAllData.length * 100);
            }
            if (self.gpsAllData.length - 1 == i) {
                self.playPercent = 100;
            }
            let gpsPoint = self.Points[i];
            let angle = self.gpsAllData[i].direction;
            self.playCurrMileage = (self.gpsAllData[i].mileage - self.gpsAllData[0].mileage) / 10;
            self.playCurrTime = new Date(self.gpsAllData[i].time).Format("yyyy-MM-dd hh:mm:ss");
            self.playAllTime = new Date(self.gpsAllData[self.gpsAllData.length - 1].time).Format("yyyy-MM-dd hh:mm:ss");
            self.carMK.setPosition(gpsPoint);
            self.map.setCenter(gpsPoint);
            self.carMK.setRotation(angle);
            self.myCompOverlay._point = gpsPoint;
            self.myCompOverlay.draw();
            $(document).find("#infoTime").html(new Date(self.gpsAllData[self.playCurrGpsI].time).Format("MM-dd hh:mm:ss"));
            $(document).find("#infoSpeed").html(self.gpsAllData[self.playCurrGpsI].speed);
            $(document).find("#address").html(self.gpsAllData[self.playCurrGpsI].lngAccuracy.toFixed(6) + "," + self.gpsAllData[self.playCurrGpsI].latAccuracy.toFixed(6));
        },
        // 暂停
        "pause": function () {
            const self = this;
            self.playflag = false;
            clearInterval(self.timeri);
            self.queryVehicleBasicInfo.call(this, self.gpsAllData[self.playCurrGpsI].time);
        },
        //快退
        "playPrev": function () {
            const self = this;
            if (self.Points.length == 0) {
                this.$Message.error("对不起，当前无轨迹，请查询后再试！");
                return;

            } else if (self.playCurrGpsI == 0) {
                this.$Message.error("对不起，当前是起点，您没有上一个点！");
                return;
            }
            self.playCurrGpsI = Math.ceil(self.playCurrGpsI) - 1;
            self.playSetVal(self.playCurrGpsI);
            self.pause();
        },
        //快进
        "playNext": function () {
            const self = this;
            if (self.Points.length == 0) {
                this.$Message.error("对不起，当前无轨迹，请查询后再试！");
                return;

            } else if (self.playCurrGpsI == self.Points.length - 1) {
                this.$Message.error("对不起，当前是终点，您没有下一个点！");
                return;
            }
            self.playCurrGpsI = Math.ceil(self.playCurrGpsI) + 1;
            self.playSetVal(self.playCurrGpsI);
            self.pause();
        },

        // //slider值在是百分比在播放中不断
        "sliderInput": function (val) {
            let flag = false;
            if (this.playflag) {
                flag = true;
            }
            clearInterval(this.timeri);
            let seti;
            if (this.gpsAllData.length > 300) {
                seti = Math.ceil((this.playPercent / 100) * this.gpsAllData.length);
            } else {
                seti = Math.floor((this.playPercent / 100) * this.gpsAllData.length);
            }
            if (this.playCurrGpsI != 0 && (this.playCurrGpsI >= this.Points.length)) {
                this.playCurrGpsI = this.Points.length - 1;
            }
            this.playCurrGpsI = seti;
            this.playSetVal(this.playCurrGpsI);
            if (flag) {
                this.play();
            }

        },
        "changeTime": function (data, type) {
            if (type == "date") {
                let time = new Date(this.endTime * 1 + 86399000);
                this.endTime = time;
            }
        },

        //获取表格高度
        "autoHight": function () {
            this.tableHeight = $("#divTable").height()  - 53  - 37 - 20;
            this.tableShow = false;
            this.tableShow = true;
        },
        //所有获取到的点处理成百度地图点存入
        "mapPullGPS": function (data) {
            const self = this;
            if (!data.length) return;
            //处理轨迹点数据
            self.gpsAllData = self.gpsAllData.concat(data);
            let points = [];
            if (self.Points.length > 0) {
                points.push(self.Points[self.Points.length - 1]);
                $.each(data, (i, item) => {
                    let lng = item.lngAccuracy; //经度
                    let lat = item.latAccuracy; //纬度
                    let Point = new BMap.Point(lng, lat);
                    self.Points.push(Point);
                    points.push(Point);
                });
            } else if (self.Points.length == 0) {
                $.each(data, (i, item) => {
                    let lng = item.lngAccuracy; //经度
                    let lat = item.latAccuracy; //纬度
                    let Point = new BMap.Point(lng, lat);
                    self.Points.push(Point);
                    points.push(Point);
                });

                let startPoint = self.Points[0];
                self.playCurrTime = new Date(self.gpsAllData[0].time).Format("yyyy-MM-dd hh:mm:ss");

                // 起始点
                let icon = require("@/assets/images/startTrack.png");
                self.renderMarker(icon, startPoint);

                // 车辆点
                let vehicleTrackIcon = require("@/assets/images/vehicleTrack.png");
                self.carMK = self.renderMarker(vehicleTrackIcon, startPoint, new BMap.Size(32, 32), {});


                self.queryVehicleBasicInfo.call(self, self.gpsAllData[0].time);
                self.map.centerAndZoom(startPoint, 11);
            }

            // 绘制轨迹
            self.renderPolyline(points, {
                "strokeColor": "#45B854",
                "strokeStyle": "dashed"
            });
        },
        //绘制gps轨迹
        "addGps": function () {
            const self = this;
            if (!self.gpsAllData.length) return;
            // 计算总里程
            self.mileageTotal = (self.gpsAllData[self.gpsAllData.length - 1].mileage - self.gpsAllData[0].mileage) / 10;

            //补偿点数组
            let arr = [];
            //漂移点数组
            // let newArr = [];
            for (let i = 0; i < self.gpsAllData.length; i++) {
                if (self.gpsAllData[i].supply == 1) {
                    if (i != 0 && arr.length == 0) {
                        // 将前面的非补偿点算进去
                        arr.push(self.gpsAllData[i - 1]);
                    }
                    arr.push(self.gpsAllData[i]);
                } else {
                    if (arr.length > 0 && self.gpsAllData[i - 1].supply == 1) {
                        arr.push(self.gpsAllData[i]);
                        self.supplys.push(arr);
                        arr = [];
                    }
                }
            }
            self.drawSupplyDrafts(self.supplys, "#F7B500"); //绘制补传数据
            // self.drawSupplyDrafts(self.draft, "#F04134"); //绘制漂移点
            //增加结束点
            let endTrackIcon = require("@/assets/images/endTrack.png");

            let lastPoint = self.Points[self.Points.length - 1];
            

            self.playAllTime = new Date(self.gpsAllData[self.gpsAllData.length - 1].time).Format("yyyy-MM-dd hh:mm:ss");

            self.renderMarker(endTrackIcon, lastPoint);

        },

        //绘制漂移点/补传数据
        drawSupplyDrafts (data = [], strokeColor) {
            const self = this;
            data.forEach((list) => {
                let points = [];
                list.forEach((item) => {
                    let lng = item.lngAccuracy; //经度
                    let lat = item.latAccuracy; //纬度
                    let Point = new BMap.Point(lng, lat);
                    points.push(Point);
                });
                self.renderPolyline(points, {
                    "strokeColor": strokeColor,
                    "strokeStyle": "dashed"
                });
            });
        },
        //递归调值
        "recursion": function () {
            const self = this;
            let params = {};
            let last = false; //最后一次查询标识
            if (self.searchCurrentStartTime == 0) {
                self.searchCurrentStartTime = self.searchTableStartTime.getTime();
            }
            params.startTime = self.searchCurrentStartTime;
            params.endTime = self.searchCurrentStartTime + (3600*1000*24-1);
            if (params.endTime >= self.searchTableEndTime.getTime()) {
                params.endTime = self.searchTableEndTime.getTime();
                last = true;
            }
            params.vehicleId = self.vehicleId;
            params.querySupply = self.retransmittedFlag;
            yd.ajax({
                "url": "/apiprovince/trackplayback/getVehicleGps",
                "type": "POST",
                "data": params,
                "contentType": "application/json;charset=utf-8",
                "success": function (result) {
                    if (result) {
                        self.mapPullGPS(result, self);
                        if (params.endTime == self.searchTableEndTime.getTime() && result.length == 0 && self.gpsAllData.length == 0) {
                            self.$Message.error("未查询到数据！请更换车辆或者查询时间！");
                        }
                    }
                    if (params.endTime < self.searchTableEndTime.getTime()) {
                        self.searchCurrentStartTime = params.endTime+1;
                        self.recursion.call(self);
                    } else {
                        self.searchCurrentStartTime = 0;
                        self.addGps.call(self);
                    }
                },
                error () {
                    self.searchCurrentStartTime = 0;
                }
            });
        },
        "recursionAlarm": function (pageNo) {
            const self = this;
            let params = {};
            params.vehicleId = self.vehicleId;
            params.alarmType =null;
            params.startTime = self.startTime.getTime();
            params.endTime = self.endTime.getTime();
            params.pageSize=1000;
            params.pageNo=(pageNo?pageNo:1);
            yd.ajax({
                "url": "/apiprovince/vehicleAlarm/selectVehicleAlarmExtendPage",
                "type": "POST",
                "dataType": "json",
                "data": params,
                success (data) {
                    self.allAlarmData = self.allAlarmData.concat(data.list);
                    if (params.pageNo*1000>=data.count) {
                        self.darwAlarm.call(self, self.allAlarmData, self.allAlarmData.length);
                    } else {
                        self.recursionAlarm.call(self,params.pageNo+1);
                    }
                },
                error () {
                    self.$Message.info("查询出错！");
                },
                complete (xhr, status) {
                    self.spinShow = false;
                }
            });

        },
        "get40001Num": function () {
            const self = this;
            let params = {};
            params.vehicleId = self.vehicleId;
            params.alarmType = "40001";
            params.startTime = self.startTime.getTime();
            params.endTime = self.endTime.getTime();
            params.pageSize=0;
            params.pageNo=1;
            yd.ajax({
                "url": "/apiprovince/vehicleAlarm/selectVehicleAlarmExtendPage",
                "type": "POST",
                "data": params,
                success (data) {
                    self.num40001 = data.count;
                }
            });
        },
        darwAlarm (data, len) {
            const self = this;
            for (let j = 0; j < data.length; j++) {
                let myCompOverlay = new ComplexCustomMarker(new BMap.Point(data[j].gpsLng, data[j].gpsLat), SubConfig.alarmType[data[j].alarmType].substr(0, 4) + "...", SubConfig.alarmType[data[j].alarmType], data[j], self);
                self.addOverlay(myCompOverlay);
            }
        },
        "getVehicleGps": function () {
            const self = this;
            self.queryPlanRoute({
                "vehicleId": self.vehicleId,
                "startTime": self.startTime.getTime(),
                "endTime": self.endTime.getTime()
            }); // 查询路线
            self.recursion.call(self);
            self.recursionAlarm.call(self);
            self.get40001Num.call(self);
        },
        "getIsExistGps": function (date) {
            date = new Date(date.Format("yyyy/MM/dd hh:mm:ss"));
            if (!this.vehicleId){return;}
            this.hasGpsDay = [];
            let params = {};
            params.startTime = new Date(new Date(date.getTime()).Format("yyyy/MM/01 00:00:00")).getTime();
            let nextMonth;
            if (date.getMonth()<11){
                let month=date.getMonth();
                nextMonth=new Date(new Date(params.startTime).setMonth(month+1))-1;
            } else {
                nextMonth=new Date(date.Format("yyyy/12/31 23:59:59")).getTime()+999;
            }
            params.endTime = nextMonth;
            params.vehicleId = this.vehicleId;
            const self = this;
            yd.ajax({
                "url": "/apiprovince/trackplayback/getIsExistGps",
                "type": "POST",
                "data": params,
                "contentType": "application/json;charset=utf-8",
                "success": function (result) {
                    if (!result) return false;
                    self.hasGpsDay=result;
                    self.getCalendarList(new Date(params.startTime));
                },
                error () {
                }
            });

        },
        //停留点
        "querystopdetaildata": function () {
            let self = this;
            let data = {
                "vehicleId": self.vehicleId,
                "startTime": self.searchTableStartTime.getTime(),
                "endTime": self.searchTableEndTime.getTime(),
                "startTimeFilterSecond": self.StartTimeFilterSecond
            };
            if (self.sortStopStartTime != "") {
                data.sortStopStartTime = self.sortStopStartTime;
            }
            if (self.sortStopTime != "") {
                data.sortStopTime = self.sortStopTime;
            }
            if (self.sortStopEndTime != "") {
                data.sortStopEndTime = self.sortStopEndTime;
            }
            yd.ajax({
                "url": "/apiprovince/v1/trajectory/query/stop/details",
                "type": "POST",
                "dataType": "json",
                "async": false,
                data,
                "contentType": "application/json;charset=utf-8",
                success (json) {
                    json.tag = json.tag == null ? [] : json.tag;
                    self.dockingStations = [];
                    self.arrStop = [];
                    //获取全部gps经纬度
                    $.each(json.tag,
                        function (i, v) {
                            self.dockingStations[i] = {};
                            self.dockingStations[i].lngAccuracy = json.tag[i].lngAccuracy;
                            self.dockingStations[i].latAccuracy = json.tag[i].latAccuracy;
                            yd.getLocation({
                                "lat": json.tag[i].latAccuracy,
                                "lng": json.tag[i].lngAccuracy
                            },
                            function (address) {
                                Vue.set(self.arrStop[i], "site", address ? address : "此位置无法解析");
                            });
                        });
                    //赋值给表格
                    self.arrStop = json.tag;
                    //循环gps经纬度创建全部停车点
                    let trackStorpIcon = require("@/assets/images/trackStorp.png");
                    $.each(self.dockingStations, function (i, v) {
                        let carP = new BMap.Icon(trackStorpIcon, new BMap.Size(32, 32), { //小车图片
                            // anchor: new BMap.Size(25,40) //图片的偏移量。为了是图片底部中心对准坐标点。
                        });
                        let Point = new BMap.Point(self.dockingStations[i].lngAccuracy, self.dockingStations[i].latAccuracy);
                        let car = new BMap.Marker(Point, {
                            "icon": carP
                        });
                        car.removeEventListener("click", attribute);
                        car.addEventListener("click", attribute);

                        function attribute() {
                            self.rowClick(json.tag[i]);
                        }
                        self.addOverlay(car);
                    });
                }
            });
        },
        //事件点事件接口
        "alarmInformation": function (clickIncidentAlarmId) {
            let self = this;
            let data = {
                "alarmId": clickIncidentAlarmId,
                "vehicleId": self.vehicleId
            };
            yd.ajax({
                "url": "/apiprovince/province/home/alarmDetail",
                "type": "GET",
                "dataType": "json",
                "data": data,
                "async": false,
                success (data) {
                    data.alarmTypeId = SubConfig.alarmType[data.alarmTypeId];
                    data.startTime = new Date(data.startTime).Format("yyyy-MM-dd hh:mm:ss");
                    data.startSpeed = data.startSpeed + "/km";
                    data.level = data.level ? SubConfig.levelreturn[data.level] : "";
                    data.time = data.time == null ? "--" : new Date(data.time).Format("yyyy-MM-dd hh:mm:ss");
                    self.alarmInformation.groupName = data.groupName;
                    self.alarmInformation.carLicense = data.carLicense;
                    self.alarmInformation.plateColor = SubConfig.plateColor[data.plateColor];
                    self.alarmInformation.driverName = data.driverName;
                    self.alarmInformation.alarmType = SubConfig.alarmType[data.alarmType];
                    self.alarmInformation.speed = data.speed;
                },
                error (data) {
                    self.alarmInformation.groupName = "";
                    self.alarmInformation.carLicense = "";
                    self.alarmInformation.plateColor = "";
                    self.alarmInformation.driverName = "";
                    self.alarmInformation.alarmType = "";
                    self.alarmInformation.speed = "";
                    self.alarmInformation.startTime = "";
                    self.alarmInformation.endTime = "";
                    self.alarmInformation.address = "";
                    self.alarmInformation.handle = "";
                    self.alarmInformation.angle = "";
                    self.alarmInformation.level = "";
                    self.alarmInformation.startGpsStatus = "";
                }
            });
        },
        "alermEvidence": function (_this, clickIncidentAlarmId) {
            let data = {
                "alarmId": clickIncidentAlarmId
            };
            yd.ajax({
                "url": "/apiprovince/alarmCenter/getAlarmEvidenceByAlarmId",
                "type": "GET",
                "dataType": "json",
                "data": data,
                "async": false,
                success (data) {
                    data = data == "" ? [] : data;
                    $.each(data, function (i, v) {
                        if (data[i].fileType == 0) {
                            _this.imgs.push(data[i].fileossId);
                        }
                        if (data[i].fileType == 2) {
                            _this.videos.push(data[i].fileossId);
                        }
                    });
                    if (_this.imgs.length < 3) {
                        let defaultImage = require("@/assets/images/trackPlaybackDefaultImage.png");
                        while (3 - _this.imgs.length > 0) {
                            _this.imgs.push(defaultImage);
                        }
                    }
                    if (_this.videos.length < 3) {
                        while (3 - _this.videos.length > 0) {
                            _this.videos.push("");
                        }
                    }
                }
            });
        },
        //查询车辆基本信息
        "queryVehicleBasicInfo": function (time) {
            const self = this;
            let content = "<div style='position: absolute;right: 0px;top: 0px;width:20px;height:20px;line-height:20px;font-size: 28px;'><i class='ivu-icon ivu-icon-ios-close close-track-infowindow ' style='font-size: 16px;'></i></div>" +
                "<div style='font-size:12px;font-weight:bold;#333;line-height: 24px;'>"+self.carLicense + "<span style='margin-right: 7px'></span>" + (self.color)+"</div>"+
                "<table id='track-infowindow' style='height: 124px;'>" +
                "<tr><td style='color: #5a5a5a'>企业名称：</td><td id='infoCompanyName' style='word-wrap:break-word;'>" + self.companyName + "</td></tr>" +
                "<tr><td style='color: #5a5a5a'>卫星定位时间：</td><td id='infoTime' style='word-wrap:break-word;'>" + self.playCurrTime + "</td></tr>" +
                "<tr><td style='color: #5a5a5a'>传输标记：</td><td id='infoTime' style='word-wrap:break-word;'>" + (self.gpsAllData[self.playCurrGpsI].supply?"补传":"实时")+ "</td></tr>" +
                "<tr><td style='color: #5a5a5a'>速度：</td><td style='word-wrap:break-word;'> <span id='infoSpeed'>" + self.gpsAllData[self.playCurrGpsI].speed + "</span>KM/H</td></tr>" +
                "<tr><td style='vertical-align: top; color: #5a5a5a'>地点：</td><td id='address' class='analysisAddress' style='width:calc(100% - 36px);vertical-align: top;word-wrap:break-word;'></td></tr>" + "</table>";
            if (self.myCompOverlay) {
                self.myCompOverlay.text = content;
                self.myCompOverlay.draw();
            } else {
                self.myCompOverlay = new ComplexCustomOverlay(self.carMK.getPosition(), content);
                self.addOverlay(self.myCompOverlay);
            }
            yd.getLocation({
                "lng": self.gpsAllData[self.playCurrGpsI].lngAccuracy,
                "lat": self.gpsAllData[self.playCurrGpsI].latAccuracy
            }, function(address) {
                $(".analysisAddress:eq(0)").html(address);
            });

            self.carMK.addEventListener("click", function () {
                self.myCompOverlay.show();
                if (self.myCompOverlay) {
                    self.myCompOverlay.show();
                    self.myCompOverlay.draw();
                } else {
                    self.myCompOverlay = new ComplexCustomOverlay(self.carMK.getPosition(), content);
                    self.addOverlay(self.myCompOverlay);

                }
                yd.getLocation({
                    "lng": self.gpsAllData[self.playCurrGpsI].lngAccuracy,
                    "lat": self.gpsAllData[self.playCurrGpsI].latAccuracy
                }, function(address){
                    $(".analysisAddress:eq(0)").html(address);
                });
            });
        },
        //导出表格
        "exportTable": function () {
            let _this = this;
            if (this.vehicleId == "" || this.vehicleId == undefined) {
                this.$Message.error("请选择车辆!");
                return false;
            }
            if (this.startTime == "") {
                this.$Message.error("请选择查询开始时间或者结束时间");
                return false;
            }
            if (this.endTime == "") {
                this.$Message.error("请选择查询开始时间或者结束时间");
                return false;
            }
            if (this.startTime.getTime() > this.endTime.getTime()) {
                this.$Message.error("开始时间不能大于结束时间!");
                return false;
            }
            if (_this.tabName == "tabName1") {
                let data = {
                    "vehicleId": _this.vehicleId,
                    "startTime": _this.startTime.getTime(),
                    "endTime": _this.endTime.getTime(),
                    "startTimeFilterSecond": _this.StartTimeFilterSecond
                };
                if (_this.sortStopStartTime != "") {
                    data.sortStopStartTime = _this.sortStopStartTime;
                }
                if (_this.sortStopTime != "") {
                    data.sortStopTime = _this.sortStopTime;
                }
                if (_this.sortStopEndTime != "") {
                    data.sortStopEndTime = _this.sortStopEndTime;
                }
                yd.exportFile("../apiprovince/trackplayback/unusualPageExport", data, "POST");
            }
            if (_this.tabName == "tabName2") {
                let data2 = {
                    "vehicleId": _this.vehicleId,
                    "startTime": _this.startTime.getTime(),
                    "endTime": _this.endTime.getTime(),
                    "querySupply": _this.retransmittedFlag
                };
                yd.exportFile("../apiprovince/trackplayback/gpsPageExport", data2, "POST");
            }
            if (_this.tabName == "tabName3") {
                let data3 = {
                    "vehicleId": _this.vehicleId,
                    // 车辆id 必传
                    "startTime": _this.startTime.getTime(),
                    "endTime": _this.endTime.getTime()
                };
                yd.exportFile("../apiprovince/vehicleAlarm/exportVehicleAlarmExtendPage", data3, "POST");
            } if (_this.tabName == "tabName4") {
                let data4 = {
                    "vehicleId": _this.vehicleId,
                    // 车辆id 必传
                    "startTime": _this.startTime.getTime(),
                    "endTime": _this.endTime.getTime(),
                    "alarmType": "40001"
                };
                yd.exportFile("../apiprovince/vehicleAlarm/exportVehicleAlarmExtendPage", data4, "POST");
            }
        },
        "secToDay": function(time){
            return yd.secToDay(time);
        },
        "clickMap": function(e){
            const self = this;
            if (e.target.className == "ivu-icon ivu-icon-ios-close close-track-infowindow ") {
                self.hideTable();
            }
        },
        openPic(data){
            this.picShow=true;
            this.picData=data;
        },
        queryPlanRoute (data) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/trackplayback/queryPlanRoute",
                "type": "POST",
                "data": data,
                success (json) {
                    json.forEach((item) => {
                        const gpsList = item.gpsList || [];
                        self.renderPlanRoute(gpsList.map((gps) => {
                            let lng = gps.lngAccuracy; //经度
                            let lat = gps.latAccuracy; //纬度
                            return new BMap.Point(lng, lat);
                        }));
                    });
                }
            });
        },
        renderMarker (icon, point, iconSize, iconOpt) {
            const self = this;
            let Icon = new BMap.Icon(icon, iconSize || new BMap.Size(45, 45), iconOpt || { //图片
                "anchor": new BMap.Size(16, 40) //图片的偏移量。为了是图片底部中心对准坐标点。
            });
            let marker = new BMap.Marker(point, {
                "icon": Icon
            });
            marker.setTop({
                "isTop": true
            });
            self.addOverlay(marker);
            return marker;
        },
        renderPolyline (points, opt = {}) {
            const self = this;
            // 绘制路线
            let polyline = new BMap.Polyline(points, {
                "strokeColor": "#0F55CF",
                "strokeWeight": 6,
                "strokeOpacity": 1,
                ...opt
            });

            //创建折线
            self.addOverlay(polyline);
            return polyline;
        },
        renderPlanRoute (gpsList) {
            const self = this;
            // 绘制路线
            self.renderPolyline(gpsList);

            // 开始点
            let startIcon = require("@/assets/images/trackReview/startPath.png");
            self.renderMarker(startIcon, gpsList[0]);
            // 结束点
            let endIcon = require("@/assets/images/trackReview/endPath.png");
            self.renderMarker(endIcon, gpsList[gpsList.length - 1]);
        },
        onReady () {
            const self = this;
            if (self.vehicleId) {
                self.defaultVehicleIds = [self.vehicleId];
                self.search();
            } 
        },
        addOverlay (marker) {
            const self = this;
            self.markers.push(marker); // 存储覆盖物以便清除
            self.map.addOverlay(marker);
        },
        clearOverlays () {
            const self = this;
            self.markers.forEach((item) => {
                self.map.removeOverlay(item);
            });
            self.markers = [];
        }

    },
    beforeRouteLeave (to, from, next) {
        const self = this;
        // 离开该页面时暂停播放
        if (self.playflag) self.pause();
        self.$nextTick(() => {
            next();
        });
    }
};