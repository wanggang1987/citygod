import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import { generateList } from "@/libs/tools";
import { steamList, renderChannelLabel, mixins } from "./base";
import loadingSpin from "_c/loading-spin";
import vehicleTree from "_c/vehicle-tree-select";
import datePanel from "./components/date-panel.vue";
import videoPlayBack from "./components/video-play-back.vue";
import CropVideo from "./components/cropVideo";
import echarts from "echarts";

export default {
    "name": "videoPlayBack",
    "mixins": [mixins],
    "components": {
        "loading-spining": loadingSpin,
        "vehicleTree": vehicleTree,
        "date-panel": datePanel,
        "video-play-back": videoPlayBack,
        "CropVideo": CropVideo
    },
    data () {
        const self = this;
        return {
            "spinShow": false,
            "date": new Date(),
            "playData": [], // 有视频的日期
            "vehicleId": 0,
            "carLicense": "",
            "videoBackMap": {}, // 视频资源map

            "steam": 2, // 码流类型
            "steamList": steamList.sort((a, b) => {
                return b.value - a.value; // 主子码流顺序颠倒
            }),
            "videoNum": 1, // 视频数
            "videoList": [], // 视频列表
            "simCardNo": 0, // sim卡号
            "flag": false, // 播放就位标记
            "playList": [], // 已播放通道
            "time": 0, // 视频查询起始时间
            "voiceFlag": true, // 是否静音标记
            "progressHeight": 151, 
            "progressTime": 0,

            "showFlag": false // 视频下载弹窗
        };
    },
    "watch": {
        flag (newVal, oldVal){
            if (newVal) this.startPlay();
        },
        vehicleId (newVal, oldVal) {
            this.searchHavePlayVideo();
        },
        videoBackDetail (newVal, oldVal) {
            this.loadCharts();
            if (newVal.length) this.renderVideoList();
        }
    },
    "computed": {
        numbers () {
            let videoNum = this.videoNum;
            let channels = this.channelOperation.length;
            let numbers = 1;
            if (!channels) return;
            if (videoNum > 1) {
                if (channels <= 2) {
                    numbers = 2;
                } else if (channels <= 4) {
                    numbers = 4;
                } else if (channels <= 6) {
                    numbers = 6;
                }
            }
            return numbers;
        },
        videoListStyle () {
            const number = this.numbers;
            const w = number > 2 ? (parseInt(number/2)) : (Math.floor(number/2) + 1);
            return { 
                "height": 100 / (Math.floor(number/4) + 1) + "%", 
                "width": 100 / w + "%" 
            };
        }
    },
    mounted () {
        const self = this;
        self.loadCharts();
        const resize = () => {
            if (self.myChart) self.myChart.resize();
        };
        window.removeEventListener("resize", resize);
        window.addEventListener("resize", resize);
    },
    "methods": {
        selectChange (json) {
            const self = this;
            self.carLicense = json.title;
            if (!json.onlineStatus) return self.$Message.error("请选择可播放视频的车辆。");
            self.vehicleId = json.vehicleId;
            self.simCardNo = json.simCardNo;
        },
        // 查询车辆有视频的日期
        searchHavePlayVideo () {
            const self = this;
            if (!self.vehicleId) return self.$Message.error("请填写有效车牌");
            if (self.spinShow) return;
            self.spinShow = true;
            self.initData();
            yd.ajax({
                "url": "../apiprovince/video/queryVideoMonthList",
                "data": {
                    "vehicleId": self.vehicleId,//车辆Id
                    "month": self.date.Format("yyyyMM")
                },
                success (json) {
                    self.playData = json || [];
                },
                error (XMLHttpRequest){
                    if (XMLHttpRequest.responseText == "offline") {
                        self.$Message.warning("车辆当前不在线！");
                    }
                    self.playData = [];
                },
                complete () {
                    self.spinShow = false;
                }
            });
        },
        renderItem (params, api) {
            let categoryIndex = api.value(0);
            let start = api.coord([api.value(1), categoryIndex]);
            let end = api.coord([api.value(2), categoryIndex]);
            let height = 1;

            let rectShape = echarts.graphic.clipRectByRect({
                "x": start[0],
                "y": start[1] - height / 2,
                "width": end[0] - start[0],
                "height": height
            }, {
                "x": params.coordSys.x,
                "y": params.coordSys.y,
                "width": params.coordSys.width,
                "height": params.coordSys.height
            });

            return rectShape && {
                "type": "rect",
                "shape": rectShape,
                "style": api.style()
            };
        },
        render (params, api) {
            let categoryIndex = api.value(0);
            let start = api.coord([api.value(1), categoryIndex]);
            let end = api.coord([api.value(2), categoryIndex]);
            let height = 8;

            let rectShape = echarts.graphic.clipRectByRect({
                "x": start[0],
                "y": start[1] - height / 4,
                "width": end[0] - start[0],
                "height": height
            }, {
                "x": params.coordSys.x,
                "y": params.coordSys.y,
                "width": params.coordSys.width,
                "height": params.coordSys.height
            });

            return rectShape && {
                "type": "rect",
                "shape": rectShape,
                "style": api.style()
            };
        },
        loadCharts () {
            const self = this;
            const dom = document.getElementById("progress");
            self.myChart = echarts.init(dom);
            self.myChart.clear();//清空绘画内容
            
            self.progressTime = 0;
            let startTime = 0;
            let categories = [];
            let bgdata = [];
            let data = [];
            self.channelOperation.forEach((channel, i) => {
                const channelName = renderChannelLabel(channel);
                categories.push(channelName);
                bgdata.push({
                    "value": [i, 0, 86399000, 86399000],
                    "itemStyle": {
                        "barWidth": 2,
                        "height": 1
                    }
                });
                let videoDetails = self.videoBackDetail[i].videoDetail;
                videoDetails.forEach((item, index) => {
                    // 时间轴起始点
                    const start = item.startTime - self.time;
                    // 获取最小值作为axisPointer起始位置
                    startTime = Math.min(startTime, start);
                    data.push({
                        "name": i,
                        "value": [
                            i,
                            start,
                            (item.endTime - self.time),
                            (item.endTime - item.startTime)
                        ],
                        "itemStyle": {
                            "barWidth": 2,
                            "height": 2
                        }
                    });
                });
            });

            let option = {
                "grid": {
                    "left": "100",
                    "right": "20",
                    "top": "30",
                    "bottom": "15"
                },
                "tooltip": {
                    "show": false,
                    "trigger": "item",
                    "axisPointer": {
                        "type": "cross"
                    }
                },
                "dataZoom": [
                    // {
                    //     type: "slider",//图表下方的伸缩条
                    //     show : true, //是否显示
                    //     start : 0, //伸缩条开始位置（1-100），可以随时更改
                    //     end : 100, //伸缩条结束位置（1-100），可以随时更改
                    //     filterMode:"filter",
                    // },
                    {
                        "type": "inside", //鼠标滚轮
                        "filterMode": "none"
                    }
                ],
                "xAxis": {
                    "axisTick": {
                        "show": true
                    },
                    "axisPointer": {
                        "value": startTime,
                        "handle": {
                            "size": 0,
                            "show": true,
                            "color": "transparent"
                        },
                        "label": {
                            "backgroundColor": "rgba(0,0,0,0.5)",
                            "borderRadius": 4,
                            "formatter": (params) => {
                                let nowTime = parseInt(params.value);
                                self.progressTime = nowTime;
                                return new Date(nowTime + self.time).Format("hh:mm:ss");
                            }
                        }
                    },
                    "min": 0,
                    "max": 86399000,
                    "interval": 7200000,
                    "axisLabel": {
                        "show": true,
                        "color": "#666",
                        "formatter": (val) => {
                            let date = val + self.time;
                            return new Date(date).Format("hh:mm");
                        }
                    },
                    "position": "top",
                    "splitLine": {"show": false},//去除网格线
                    // axisTick:{show:false},
                    "axisLine": {
                        "onZero": false,
                        "lineStyle": {
                            "color": "#979797"
                        }
                    }
                },
                "yAxis": {
                    "inverse": true,
                    "data": categories,
                    "axisPointer": {"show": false},
                    "axisLine": {
                        "show": false
                    },
                    // splitLine :{    //网格线
                    //     lineStyle:{
                    //         type:'dotted'    //设置网格线类型 dotted：虚线   solid:实线
                    //     },
                    //     show:true //隐藏或显示
                    // },
                    "axisTick": {"show": false}
                },
                "series": [
                    {
                        "type": "custom",
                        "renderItem": self.renderItem,
                        "itemStyle": {
                            "normal": {
                                "color": "#CCCCCC"
                            }
                        },
                        "encode": {
                            "x": [1, 2],
                            "y": 0
                        },
                        "data": bgdata
                    }, {
                        "type": "custom",
                        "renderItem": self.render,
                        "itemStyle": {
                            "normal": {
                                "color": self.steam == 1 ? "#00A854" : "#108EE8"
                            }
                        },
                        "encode": {
                            "x": [1, 2],
                            "y": 0
                        },
                        "data": data
                    }
                ]
            };
            self.myChart.setOption(option, true);
        },
        // 时间轴开始播放
        startPlay () {
            const self = this;
            let time = self.startTime;
            clearInterval(self.timer);
            self.value = time - self.time;
            self.timer = setInterval(() => {
                let opt = self.myChart.getOption();
                self.value += 1000;
                if (self.value > 86399000) return clearInterval(self.timer);
                if ($("#progress").is(":hover")) return;
                opt.xAxis[0].axisPointer.value = self.value;
                self.myChart.setOption(opt, true);
                self.verDelay();
            }, 1000);
        },
        // 检查延迟播放列表是否有需要播放的
        verDelay () {
            const self = this;
            let delay = {};
            $.each(self.delay || [], function(key, item) {
                // 如果延迟时间结束则开始播放，否则继续等待
                if (item.startTime <= (self.value + self.time)) {
                    const video = item.liveVideo;
                    video.startPlay();
                } else {
                    delay[key] = item;
                }
            });
            self.delay = delay;
        },
        initData () {
            const self = this;
            clearInterval(self.timer);
            self.videoBackMap = {};
            self.videoList = [];
        },
        changeDate (date) {
            this.date = date;
            this.searchHavePlayVideo();
        },
        checkedDate ({ date }) {
            const self = this;
            const day = new Date(date.Format("yyyy-MM-dd 00:00:00"));
            self.time = day.getTime();
            self.startTime = self.time;
            self.queryVideoBackDetail(day.Format("yyyy-MM-dd"));
        },
        //查询车辆某天行程回放资源信息
        queryVideoBackDetail (date) {
            const self = this;
            if (self.spinShow) return;
            self.spinShow = true;
            self.videoBackMap = {};
            const liveVideos = this.$refs.liveVideo || [];
            liveVideos.forEach((video, i) => {
                video.cancel();
            });
            yd.ajax({
                "url": "../apiprovince/video/queryVehicleVideoDayList",
                "data": {
                    "vehicleId": self.vehicleId,
                    "recordDay": date
                },
                success (json){
                    self.myChart.clear();
                    if (json == "offline"){
                        self.$Message.error("车辆当前不在线！");
                    } else {
                        if (json){
                            self.videoBackMap = json;
                        }
                    }
                },
                error (json) {
                    if (json.responseText == "offline") {
                        self.$Message.error("车辆当前不在线！");
                    }
                },
                complete () {
                    self.spinShow = false;
                }
            });
        },
        renderVideoList () {
            const self = this;
            clearInterval(self.timer);
            self.flag = false;
            let videoList = [];
            let playList = [];
            self.value = 0;
            for (let i = 0;i < self.numbers; i++){
                const channel = self.channelOperation[i];
                let obj = {
                    "channel": "",
                    "channelList": self.channelList,
                    "simCardNo": self.simCardNo,
                    "startTime": "",
                    "vehicleId": self.vehicleId
                };
                if (channel) {
                    playList.push(channel);
                    let video = self.videoBackDetail[i].videoDetail[0];
                    obj = {
                        ...obj,
                        "id": video.id, // 视频资源ID
                        "channel": channel,
                        "startTime": video.startTime
                    };
                }
                videoList.push(obj);
            }
            self.videoList = videoList;
            self.playList = playList; // 已占用通道
        },
        clickProgress () {
            const self = this;
            let time = self.progressTime;

            if (!time) return self.$Message.error("您选择的时间没有数据！请重新选择！");
            let liveVideos = []; // 立即播放
            self.delay = {}; // 延迟播放
            
            self.videoList.forEach((video, i) => {
                const channel = video.channel;
                if (!channel) return;
                self.queryVideo(channel, (item) => {
                    const start = item.startTime - self.time;
                    const end = item.endTime - self.time;
                    const channel = item.channel;
                    const id = item.id;
                    const liveVideo = self.$refs.liveVideo[i];
                    if (time >= start && time < end) {
                        // 点击时间在当前视频资源区间内则立即播放
                        self.changeVideoList(i, {
                            "startTime": time + self.time,
                            "id": id
                        });
                        
                        liveVideos.push(liveVideo);
                        return false;
                    } else if (start > time && (start - time) < 180000 && (!self.delay[channel] || self.delay[channel].startTime > item.startTime)){
                        // 点击时间不在当前视频资源区间内，获取点击时间之后最近的的视频资源区间并存入延迟播放列表（PS：由于视频回放单次只能播放60S，因此时间差大于60S忽略）
                        self.changeVideoList(i, {
                            "startTime": time + self.time,
                            "id": id
                        });

                        self.delay[channel] = {
                            "startTime": item.startTime,
                            "liveVideo": liveVideo
                        };
                        return false;
                    }
                });

            });

            self.$nextTick(() => {
                liveVideos.forEach((video, i) => {
                    video.startPlay();
                });
                
            });
            clearInterval(self.timer);
            self.flag = false;
        },
        queryVideo (channel, callBack) {
            const self = this;
            const videoBackDetail = self.videoBackDetail.filter((item) => {
                return item.channel == channel;
            });
            const videoDetails = videoBackDetail[0].videoDetail || [];
            videoDetails.every((item) => {
                const flag = callBack(item);
                if (flag === false) return false;
                else return true;
            });
        },
        // 切换播放视频数
        changeNum () {
            const self = this;
            if (!self.vehicleId || !self.time) return;
            self.renderVideoList();
        }, 
        //截图
        screenshot () {
            let self = this;
            if (!self.vehicleId) return self.$Message.warning("请先选择车牌号");
            if (!self.time) return self.$Message.warning("请先选择日期");
            let arr = [];
            if (self.$refs.liveVideo){
                $.each(self.$refs.liveVideo, function(i,item) {
                    let img = item.captureScreen();
                    if (img){
                        let channel = renderChannelLabel(item.channel);
                        arr.push(channel);
                        let imgData = img.src;
                        let time = parseInt(img.title);
                        let dateName = self.carLicense+"_"+channel+"_"+(new Date(time).Format("yyyy-MM-dd hh_mm_ss"))+".png";
                        self.downloadFile(dateName, imgData);
                    }
                });
            };
            if (arr.length > 0) return self.$Message.info(arr.toString()+"截图成功！");
            self.$Message.error("截图失败！");
        },
        // 视频下载
        crop () {
            const self = this;
            if (!self.vehicleId) return self.$Message.warning("请先选择车牌号");
            if (!self.time) return self.$Message.warning("请先选择日期");
            self.showFlag = true;
        },
        changeVideoList (index, params) {
            const self = this;
            const video = self.videoList[index];
            self.$set(self.videoList, index, {
                ...video,
                ...params
            });
        },
        changeChannel (index, channel) {
            const self = this;
            let obj = {};
            let time = self.value || (self.startTime - self.time);
            self.queryVideo(channel, (item) => {
                const start = item.startTime - self.time;
                const end = item.endTime - self.time;
                const channel = item.channel;
                const id = item.id;
                if (time >= start && time < end) {
                    // 当前时间在当前视频资源区间内则返回当前资源区间
                    obj = {
                        "startTime": time + self.time,
                        "id": id
                    };
                    return false;
                } else if (start > time){
                    // 当前时间不在当前视频资源区间内，获取当前时间之后最近的的视频资源区间
                    obj = {
                        "startTime": item.startTime,
                        "id": id
                    };
                    return false;
                }
            });
            self.changeVideoList(index, {
                ...obj,
                "channel": channel
            });
            self.$set(self.playList, index, channel);
            if (self.playList.length == 1) {
                clearInterval(self.timer);
                self.flag = false;

                if (obj) {self.$nextTick(() => {
                    const video = self.$refs.liveVideo[0];
                    video.startPlay();
                });}
            }
        },
        onReady (time) {
            const self = this;
            if (self.flag) return;
            self.startTime = time;
            self.flag = true;
        },
        downloadFile (fileName, content) {
            // 转换完成，创建一个a标签用于下载
            let a = document.createElement("a");
            a.download = fileName;
            a.href = content;
            $("body").append(a);    // 修复firefox中无法触发click
            a.click();
            $(a).remove();
        },
        //关闭声音
        closeViose (flag) {
            let self = this;
            self.voiceFlag = flag;
            const volume = flag ? 10 : 0;
            const videos = self.$refs.liveVideo || [];
            videos.forEach((item) => {
                item.volume = volume;
                item.changeVolume(volume);
            });
        }
    },
    "beforeRouteLeave": function(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        clearInterval(this.timer);
        const liveVideos = this.$refs.liveVideo || [];
        liveVideos.forEach((video, i) => {
            video.renew();
        });
        this.$nextTick(() => {
            next();
        });
    }
};