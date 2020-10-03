import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import liveVideo from "_c/live-video";
import treeSelector from "_c/vehicle-tree-select";
import loadingSpin from "_c/loading-spin";

export default {
    "name": "realTimeMonitor",
    "components": {
        "live-video": liveVideo,
        "tree-selector": treeSelector
    },
    "data": function() {
        const self = this;
        return {
            "videoList": [],
            "pageNo": 1,
            ///巡检需要页码,来标记当前查询车辆
            "vehicles": [],
            "isPlay": false,
            "playTag": 0,
            "stopTag": 0,
            "times": 0,
            "videoNum1": 4,
            "videoNum2": 4,
            "videoNum": 4,
            "countdownTimer": "",
            "channelList": {},
            "type": 3,
            "allVideoPalyFlag": true,
            "videoShowflag": {},//车辆播放视频状态 1 为选择车辆 2可点击播放  3 车辆不在线
            "channels": {},
            "picChannel": -1,//抓拍下发值
            "checkVehicle": false,
            "channelModal": false,
            "simCardNo": {},
            "vehiclelist": []
        };
    },
    mounted () {
        this.$Message.config({
            "top": 500,
            "duration": 3
        });
    },
    "methods": {
        //选择车辆
        getVehicles(vehicles) {
            const self = this;
            self.checkVehicle=vehicles.length?true:false;
            self.videoList=[];
            self.vehicles=[];
            self.channelList={};
            self.simCardNo={};
            self.videoShowflag={};
            self.channels={};
            clearInterval(self.countdownTimer);
            this.isPlay = false;
            for (let i in vehicles){
                if (vehicles[i].onlineStatus==1){
                    self.vehicles.push(vehicles[i].id);
                    if (self.vehicles.length>6){
                        self.$Message.info("最多支持6辆车");
                        return;
                    }
                    self.queryVehicles(vehicles[i]);

                } else {
                    self.$Message.info("该车辆不可播放，无法展示实时视频");
                    return;
                }
            }
        },
        //全部开始  全部暂停
        "playControl": function(flag) {
            const self = this;
            if (!self.videoList.length) {return self.$Message.info({
                "top": 800,
                "content": "请选择可播放车辆",
                "duration": 3
            });}
            self.allVideoPalyFlag = !self.allVideoPalyFlag;
            if (self.isPlay&&flag=="stop") {
                self.isPlay = false;
                self.times = 0;
                self.stopTag = new Date().getTime();
                clearInterval(self.countdownTimer);
            } else if (!self.isPlay&&flag=="start") {
                self.isPlay = true;
                self.times = 60*5;
                self.playTag = new Date().getTime();
                self.countDown.call(self); //倒计时
            }
        },
        //加载视频
        "renderVideoList": function(vehicle) {
            let videoList = [];
            let len = 4;
            let self=this;
            let vehicleId=vehicle.id;
            if (4 > self.channelList[vehicleId].length) {
                len = self.channelList[vehicleId].length;
            } else {
                len = 4;
            }
            if (self.channelList[vehicleId].length == 0) {
                len = 4;
            }

            for (let i = 0; i < len; i++) {
                if (i >= self.channelList[vehicleId].length) {
                    videoList.push({
                        "channel": 0,
                        "channelLabel": "通道1",
                        "steam": 1,
                        "steamLabel": "子码流",
                        "flag": true,
                        "node": "video_"+ vehicleId + "_" + i,
                        "isFirst": false,
                        "volume": 0,
                        "isFullScreen": false,
                        "msg": self.simCardNo[vehicleId] ? "该通道暂无视频": "该车辆未查询到sim卡号",
                        "channelList": self.channelList[vehicleId],
                        "simCardNo": self.simCardNo[vehicleId],
                        "vehicleId": vehicleId
                    });
                } else {
                    videoList.push({
                        "channel": self.channelList[vehicleId][i].value,
                        "channelLabel": self.channelList[vehicleId][i].label,
                        "steam": 1,
                        "steamLabel": "子码流",
                        "flag": self.simCardNo[vehicleId] ? false: true,
                        "node": "video_"+ vehicleId + "_" + i,
                        "isFirst": self.simCardNo[vehicleId] ? true: false,
                        "volume": 0,
                        "isFullScreen": false,
                        //全屏
                        "msg": self.simCardNo[vehicleId] ? "该通道暂无视频": "该车辆未查询到sim卡号",
                        "channelList": self.channelList[vehicleId],
                        "simCardNo": self.simCardNo[vehicleId],
                        "vehicleId": vehicleId
                    });
                }
            }
            vehicle.videoList=videoList;
            self.videoList.push(vehicle);
        },
        //查询车辆信息
        "queryVehicles": function(vehicle) {
            let send = this;
            let vehicleId=vehicle.id;
            send.channels[vehicleId] = vehicle.channel.split(",");//取通道数据用于抓拍
            send.channelList[vehicleId] = send.getQueryChannel(vehicle);
            send.simCardNo[vehicleId] = vehicle.simCardNo;
            send.videoShowflag[vehicleId] = "2";
            setTimeout(function () {
                send.renderVideoList(vehicle);
            },50);


        },
        //修改通道值格式
        "getQueryChannel": function(item) {
            if (item.channel == null) return [];
            let ChannelOperation = item.channel.split(",");
            let channelList = [];
            let arr = [];
            $.each(ChannelOperation, function(i, item) {
                arr.push(parseInt(item));
            });
            arr = arr.sort(function(a, b) {
                return a - b;
            });
            $.each(arr, function(i, item) {
                channelList.push({
                    "value": item,
                    "label": SubConfig.videoChannel[item]
                });
            });
            return channelList;
        },
        //播放倒计时一分钟
        "countDown": function() {
            const self = this;
            self.countdownTimer = setInterval(function() {
                self.times--;
                if (self.times == 0) {
                    clearInterval(self.countdownTimer);
                    self.isPlay = false;
                }
            }, 1000);
        }
    },
    beforeRouteLeave (to, from, next) {
        const self = this;
        // 离开该页面时暂停播放
        if (self.isPlay) self.playControl();
        self.$nextTick(() => {
            next();
        });
    }
};