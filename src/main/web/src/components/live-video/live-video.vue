<template>
    <div class="videoPlayWarp pr realTimeVideo" @mouseover="hover=true" @mouseout="hover=false">
        <div class="tac pa" style="width:100%;height:100%;z-index: 998;display:table;" v-show="isFirst">
            <a href="javascript:void(0)" @click="startPlay" style="font-size: 60px;display: table-cell;vertical-align: middle;cursor:pointer;">
                <Icon type="md-play" style="color:#fff;"></Icon>
            </a>
        </div>
        <div class="videoPlayBtn" v-show="channel&&hover" style="z-index:999;">
            <Poptip trigger="hover" placement="bottom" width="120" style="margin: 0 5px;">
                <Button class="ivu-btn ivu-btn-primary videoBtn">{{channelLabel}}</Button>
                <ul slot="content" style="margin:0;">
                    <li v-for="(item, index) in channelList" :key="index" @click="changeChannel(item)">{{ item.label }}</li>
                </ul>
            </Poptip>
            <Poptip trigger="hover" placement="bottom" width="75" style="margin: 0 5px;">
                <Button class="ivu-btn ivu-btn-primary videoBtn">{{steamLabel}}</Button>
                <ul slot="content" style="margin:0;">
                    <li v-for="(item, index) in steamList" :key="index" @click="changeSteam(item)">{{ item.label }}</li>
                </ul>
            </Poptip>
        </div>
        <div :class="['videoPlayContent',node]">
            <video :id="node" class="video-js"></video>
            <div class="tac pa" style="width:100%;top:50%" v-show="flag">{{msg}}</div>
        </div>
    </div>
</template>

<script>

import $ from "jquery";
import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";
import videojs from "video.js";
import "videojs-contrib-hls";


export default {
    "name": "live-vodeo",
    "components": {},
    "props": {
        "data": {
            "type": Object,
            default () {
                return {};
            }
        },
        "pause": {
            "type": Boolean,
            "default": false
        },
        "playflag": {
            "type": Number,
            "default": 0
        },
        "stopflag": {
            "type": Number,
            "default": 0
        },
        "captureflag": {
            "type": Number,
            "default": 0
        },
        "tag": {
            "type": Boolean,
            "default": false
        }
    },
    "data": function () {
        return {
            "vehicleId": "",
            "spinShow": false,
            "channel": 1,
            "channelLabel": "通道1",
            "steam": 1,
            "steamLabel": "子码流",
            "channelList": [],//视频通道
            "simCardNo": "",
            "steamList": [
                {
                    "value": 0,
                    "label": "主码流"
                },
                {
                    "value": 1,
                    "label": "子码流"
                }
            ],
            "flag": false,
            "node": "liveVideo",
            "timer": {},
            "msg": "该通道暂无视频",
            "url": "",
            "isFirst": true,
            "number": 0,
            "replay": {},
            "hover": false,
            "num": 1
        };
    },
    "watch": {
        "data": function (newVal, oldVal) {
            const self = this;
            clearInterval(self.timer);
            clearTimeout(self.replay);
            if (self.myPlayer) {
                $("#" + self.node).replaceWith("<video id=\"" + self.node + "\" class=\"video-js\"></video>");
                self.myPlayer.dispose();
                self.myPlayer = "";
            }
            self.renew();
        },
        "isFirst": function (newVal, oldVal) {
            const self = this;
            if (newVal) {
                self.flag = false;
                clearInterval(self.timer);
                clearTimeout(self.replay);
                if (self.myPlayer) {
                    $("#" + self.node).replaceWith("<video id=\"" + self.node + "\" class=\"video-js\"></video>");
                    self.myPlayer.dispose();
                }
            }
        },
        "flag": function (newVal, oldVal) {
            const self = this;
            if (newVal) clearInterval(self.timer);
        },
        "pause": function (newVal, oldVal) {
            const self = this;
            if (newVal) {
                self.isFirst = true;
                // self.flag=false;
            }
        },
        "playflag": function (newVal, oldVal) {
            const self = this;
            self.startPlay();
        },
        "stopflag": function (newVal, oldVal) {
            const self = this;
            if (self.simCardNo && self.channel) self.isFirst = true;
        },
        "captureflag": function (newVal, oldVal) {
            const self = this;
            self.captureScreen();
        },
        "tag": function (newVal, oldVal) {
            const self = this;
            if (newVal) {
                self.startPlay();
            } else {
                if (self.simCardNo && self.channel) self.isFirst = true;
            }
        }
    },
    created () {
        const self = this;
        self.renew();
    },
    mounted () {
        const self = this;
    },
    "beforeDestroy": function () {
        const self = this;
        if (self.myPlayer) {
            clearInterval(self.timer);
            clearTimeout(self.replay);
            self.myPlayer.dispose();
            self.myPlayer = "";
        }
    },
    "methods": {
        "renew": function () {
            const self = this;
            for (let i in self.data) {
                self.$set(self.$data, i, self.data[i]);
            }
        },
        "startPlay": function() {
            const self = this;
            self.isFirst=false;
            if (!self.channel||!self.simCardNo) return;
            yd.ajax({
                "url": "../commandprovince/video/start",
                "type": "POST",
                "data": {
                    "vehicleId": parseInt(self.vehicleId),
                    "channel": parseInt(self.channel),
                    "videoType": parseInt(self.steam),  //0主码流 1子码流
                    "simcard": self.simCardNo
                },
                success (json) {
                    self.num=0;
                    self.getStart();
                },
                "error": function(XMLHttpRequest, textStatus, errorThrown){
                    let msg=XMLHttpRequest.responseText;
                    self.msg=msg;
                    self.flag=true;
                }

            });
        },
        "getStart": function () {
            const self = this;
            self.isFirst = false;
            if (!self.channel || !self.simCardNo) return;
            if (self.num == 5 ) return;
            yd.ajax({
                "url": "../commandprovince/video/queryVideoIfPlaying",
                "type": "POST",
                "data": {
                    "vehicleId": parseInt(self.vehicleId),
                    "channel": parseInt(self.channel)
                },
                success (json) {
                    if (json.url){
                        self.initialize(json.url);
                    } else {
                        self.num +=1;
                        self.queryFlag = setTimeout(() => {
                            self.getStart();
                        },5000);
                    }
                },
                error (XMLHttpRequest, textStatus, errorThrown) {
                    let msg = XMLHttpRequest.responseText;
                    self.msg = msg;
                    self.flag = true;
                }

            });
        },
        "initialize": function (url) {
            const self = this;
            self.myPlayer = videojs(self.node, {
                "controls": true,
                "preload": "auto",
                "muted": true,
                "bigPlayButton": false,
                "errorDisplay": false,
                "textTrackDisplay": false,
                "controlBar": {
                    "remainingTimeDisplay": false,
                    "volumePanel": {
                        "inline": false
                    },
                    "progressControl": {
                        "seekBar": false
                    }
                }
            }, function () {
                let myPlayer = this;
                myPlayer.src({
                    "src": url,
                    "type": "application/x-mpegURL"
                });
                myPlayer.play();
                self.number = 0;
                self.url = url;
                self.startHeatBeat();
            });
            self.myPlayer.off("error");
            self.myPlayer.on("error", function () {
                // if(self.number!=60){
                self.replay = setTimeout(() => {
                    self.myPlayer.src({
                        "src": self.url,
                        "type": "application/x-mpegURL"
                    });
                    self.myPlayer.play();
                }, 3000);
                //     self.number+=1;
                // }else{
                //     self.myPlayer.pause();
                //     self.msg="视频播放失败";
                //     self.flag=true;
                // }
                // self.spinShow=false;
            });

        },
        "changeChannel": function (item) {
            const self = this;
            if (item.value == self.channel) return;
            self.isFirst = true;
            // self.flag=false;
            self.channel = item.value;
            self.channelLabel = item.label;
            self.$emit("changeChannel", item);
        },
        "changeSteam": function (item) {
            const self = this;
            if (item.value == self.steam) return;
            self.isFirst = true;
            // self.flag=false;
            self.steam = item.value;
            self.steamLabel = item.label;
        },
        "startHeatBeat": function () {
            const self = this;
            self.timer = setInterval(function () {
                yd.ajax({
                    "url": "../commandprovince/video/heartbeat",
                    "type": "POST",
                    "data": {
                        "vehicleId": parseInt(self.vehicleId),
                        "channel": parseInt(self.channel),
                        "type": parseInt(self.steam),  //0主码流 1子码流
                        "simcard": self.simCardNo
                    },
                    "contentType": "application/json;charset=utf-8",
                    "dataType": "json",
                    "success": function (result) {
                        if (!result) {
                            clearInterval(self.timer);
                            self.myPlayer.pause();
                            self.isFirst = true;
                        }

                    },
                    error (msg) {
                        console.error("heartbeat failed." + msg);
                    }
                });
            }, 5000);
        },
        "captureScreen": function () {
            const self = this;
            // let scale = 1;
            let canvas = document.createElement("canvas");
            let video = document.getElementById(self.node + "_html5_api");
            if (!video) return "";
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            let blank = canvas.toDataURL();
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            let src = canvas.toDataURL("image/png");
            if (src == blank) return "";//过滤空白图片
            let img = document.createElement("img");
            img.src = src;
            canvas.toDataURL("image/png");
            return img.src != "data:," ? img : "";
        }
    }
};
</script>
