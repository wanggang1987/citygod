import * as yd from "@/libs/yd";
import customModalBase from "_m/customModalBase";
import { steamList, mixins } from "../../base";
import { verTime } from "./rules.js";

export default {
    "name": "CropVideo",
    "mixins": [customModalBase, mixins],
    "props": {
        "data": {
            "type": Array,
            default () {
                return [];
            }
        },
        "vehicleId": {
            "type": Number,
            "default": 0
        },
        "day": {
            "type": Number,
            "default": new Date().getTime()
        }
    },
    data () {
        return {
            "videoBackMap": {}, // 视频资源map
            "steam": 2, // 码流类型
            "steamList": steamList.sort((a, b) => {
                return b.value - a.value; // 主子码流顺序颠倒
            }),
            "startTime": "00:00:00",
            "endTime": "00:00:01",
            "channel": [],
            "error": {
                "endTime": "",
                "channel": ""
            },
            "timer": "",
            "list": []
        };
    },
    "watch": {
        videoBackDetail (newVal, oldVal) {
            this.queryVideoList();
        },
        channel (newVal, oldVal) {
            this.queryVideoList();
        }
    },
    "methods": {
        init () {
            const self = this;
            self.steam = 2;
            self.startTime = "00:00:00";
            self.endTime = "00:00:01";
            self.channel = [];
            self.videoBackMap = self.data;
            self.error = {
                "endTime": "",
                "channel": ""
            };
        },
        change () {
            const self = this;
            const error = verTime(self.startTime, self.endTime);
            self.$set(self.error, "endTime", error);
            if (!error) self.queryVideoList();
        },
        queryVideoList () {
            const self = this;
            clearTimeout(self.timer);
            self.timer = setTimeout(() => {
                self.filter();
            }, 500);
        },
        filter () {
            const self = this;
            let list = [];
            const day = new Date(self.day).Format("yyyy-MM-dd");
            const startTime = new Date(`${day} ${self.startTime}`).getTime();
            const endTime = new Date(`${day} ${self.endTime}`).getTime();
            self.videoBackDetail.forEach((item) => {
                if (self.channel.indexOf(item.channel) == -1) return;
                item.videoDetail.every((video) => {
                    // 资源列表是按时间先后顺序排列的
                    if (video.endTime < startTime) return true; // 如果资源结束时间小于开始下载时间，可知下载时间段在此资源之后，则进行下一资源检测
                    if (video.startTime > endTime) return false; // 如果资源开始时间大于结束下载时间，可知下载时间段在此资源之前，则结束循环
                    if (video.startTime <= startTime || video.endTime >= endTime) {
                        // 如果资源的开始时间小于等于开始下载时间或者资源结束时间大于等于结束下载时间，可知此资源需要下载
                        list.push({
                            ...video,
                            "vehicleId": self.vehicleId,
                            "startTime": Math.max(video.startTime, startTime), 
                            "endTime": Math.min(video.endTime, endTime)
                        });
                    }
                    return true;
                });
            });
            self.list = list;
        },
        ok () {
            const self = this;
            let endTimeValid = verTime(self.startTime, self.endTime);
            self.$set(self.error, "endTime", endTimeValid);
            let channelValid = self.channel.length ? "" : "请选择通道号";
            self.$set(self.error, "channel", channelValid);
            if (!endTimeValid && !channelValid) {
                if (!self.list.length) return self.$Message.error("当前下载无视频");
                self.list.forEach((item) => {
                    self.submit(item);
                });
                self.modal = false;
                self.$emit("on-success");
                yd.downloadResultsModal.call(self, true);
            }
        },
        submit (params) {
            yd.ajax({
                "url": "../apiprovince/video/replay/download",
                "type": "POST",
                "data": params
            });
        }

    }
};