<template>
<div class="videoPlayWarp pr" @mouseover="hover=true" @mouseout="hover=false">
    <div class="tac pa" style="width:100%;height:100%;z-index: 998;display:table;" v-show="isFirst">
        <a href="javascript:void(0)" @click="startPlay" style="font-size: 60px;display: table-cell;vertical-align: middle;cursor:pointer;">
            <Icon style="color:#fff;" custom="iconfont icon_all_start" size="40"></Icon>
            <!-- <i style="color: #fff;font-size: 28px;cursor: pointer" class="iconfont icon_xingzhuang"></i> -->
        </a>
    </div>
    <div class="videoPlayBtn" v-show="flag&&!isFullScreen" style="z-index:999;background: none;padding: 0px;text-align: left;">
        <Poptip popper-class="videoPalckBackPop" trigger="hover" placement="bottom" width="76" :disabled="disabled">
            <i-button type="primary" class="videoBtn" style="border-radius: 0px;">{{channelLabel}}<Icon type="ios-arrow-down" />
            </i-button>
            <ul slot="content" style="margin:0;">
                <li v-for="item in channelList" :key="item.value" @click="changeChannel(item)">{{ item.label }}</li>
            </ul>
        </Poptip>
    </div>
    <div :class="['videoPlayContent', node]">
        
        <video :id="node" class="video-js"></video>
        <div class="tac pa" style="width:100%;top:calc(50% - 35px);color:#999;" v-show="!flag">
        </div>
        <div class="tac pa" style="width:100%;top:calc(50% - 9px);color:#999;" v-show="isOccupancy">{{msg}}</div>
        <div style="position:absolute;top:0;width:100%;height:100%;"></div>
    </div>
    <div class="videoPlayControl" v-show="flag && !isOccupancy && hover">
        <a href="javascript:void(0);" @click="play" title="播放" v-show="!isPlay"><Icon type="md-play" /></a>
        <a href="javascript:void(0);" @click="stop" title="暂停" v-show="isPlay"><Icon type="md-pause" /></a>
        <a href="javascript:void(0);" @click="fullScreen" title="全屏" class="fr" v-show="!isFullScreen"><Icon type="md-expand" /></a>
        <a href="javascript:void(0);" @click="exitFullscreen" title="退出全屏" class="fr" v-show="isFullScreen"><Icon type="md-contract"></Icon></a>
        <a href="javascript:void(0);" title="音量" class="fr">
            <i :class="{ 'ivu-icon':true, 'ivu-icon-md-volume-off':volume==0, 'ivu-icon-md-volume-up':volume!=0} "></i>
            <Slider class="sliderVolume" v-model="volume" step="1" max="10" @on-change="changeVolume"></Slider>
        </a>
    </div>
</div>
</template>

<script>
import $ from "jquery";
import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";
import { errorMsg, renderChannelLabel } from "../base";
import axios from "axios";
import md5 from "js-md5";
import videojs from "video.js";
import "videojs-contrib-hls";

export default {
    "name": "videoPlayBack",
    "props": {
        "data": {
            "type": Object,
            "default": () => {
                return {};
            }
        },
        "playlist": {
            "type": Array,
            "default": () => {
                return [];
            }
        }
    },
    data () {
        return {
            "id": 0, // 视频资源ID
            "vehicleId": "",
            "channel": 1, // 通道号 
            "channelList": [],//视频通道
            "simCardNo": "",
            "flag": true,
            "isOccupancy": false,//通道占用
            "node": `video_${parseInt(Math.random() * 1000)}`,
            "isFirst": true,
            "curTime": 0,
            "isPlay": false,
            "volume": 10,
            "isFullScreen": false,//全屏
            "timer": {},
            "replay": {},
            "hover": false,
            "msg": "该通道暂无视频",
            "startTime": 0, //结束时间开始时间
            "url": ""
        };
    },
    "computed": {
        channelLabel () {
            return renderChannelLabel(this.channel);
        },
        disabled () {
            return this.playlist.length != 1; // 非单通道时不允许切换通道
        }
    },
    "watch": {
        data (newVal, oldVal) {
            const self = this;
            self.renew();
        },
        isPlay (newVal, oldVal) {
            if (this.myPlayer){
                if (newVal){
                    this.myPlayer.play();
                } else {
                    this.myPlayer.pause(); 
                }
            }
        },
        isFirst (newVal, oldVal) {
            const self = this;
            if (newVal) {
                self.flag = true;
                self.msg = "该通道暂无视频";
                self.isOccupancy = false;
                clearInterval(self.timer);
                clearTimeout(self.replay);
                if (self.myPlayer) {
                    self.myPlayer.dispose();
                    $(`.${self.node}`).prepend(`<video id="${self.node}" class="video-js"></video>`);
                    self.myPlayer = null;
                }
            }
        },
        volume (newVal, oldVal) {
            let self = this;
            self.$emit("change-voice", newVal);
        }
    },
    created () {
        let self = this;
        self.renew();
    },
    mounted () {
        const self = this;
        //监听退出全屏事件
        window.addEventListener("resize", self.resize);
    },
    beforeDestroy () {
        const self = this;
        if (self.myPlayer) self.myPlayer.dispose();
        self.close();
        window.removeEventListener("resize", self.resize);
        self.cancel();
    },
    "methods": {
        resize () {
            const self = this;
            if (!self.checkFull()) {
                let that = window.videoPlayBackObj;
                if (that) that.isFullScreen=false;
            }
        },
        renew () {
            const self = this;
            const json = self.data;
            for (let i in json){
                self.$set(self.$data, i, self.data[i]);
            }
            self.flag = !!self.channel;
            self.isOccupancy = false; //通道占用
            self.isFirst = !!self.channel;
            self.curTime = 0;
            self.isPlay = false;
            self.volume = 10;
            self.isFullScreen = false; // 全屏
            self.msg = "该通道暂无视频";
            clearInterval(self.timer);
            clearTimeout(self.replay);
            self.cancel();
        },
        startPlay () {
            const self = this;
            self.isFirst = false;
            self.isPlay = true;
            self.playVideo();
        },
        play () {
            const self = this;
            self.isPlay = true;
            self.playControl(5);
        },
        stop () {
            const self = this;
            self.isPlay = false;
            self.playControl(5);
        },
        changeVolume (val) {
            const self = this;
            if (self.myPlayer) self.myPlayer.volume(val/10);
        },
        fullScreen () {
            const self = this;
            // let key=self.node.split("_")[1];
            // let element=$(".videoPlayWarp")[key];
            let element = self.$el;
            let requestMethod = element.requestFullScreen || //W3C
                element.webkitRequestFullScreen || //FireFox
                element.mozRequestFullScreen || //Chrome等
                element.msRequestFullScreen; //IE11
            if (requestMethod) {
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                const ActiveXObject = window.ActiveXObject;
                let wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            self.isFullScreen=true;
            window.videoPlayBackObj=self;
        },
        exitFullscreen () {
            const self = this;
            let exitMethod = document.exitFullscreen || //W3C
                document.mozCancelFullScreen || //FireFox
                document.webkitExitFullscreen || //Chrome等
                document.webkitExitFullscreen; //IE11
            if (exitMethod) {
                exitMethod.call(document);
            } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
                const ActiveXObject = window.ActiveXObject;
                let wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            self.isFullScreen=false;
        },
        formatTime (val) {
            return yd.parsedSecond(parseInt(val/1000));
        },
        changeChannel (item) {
            const self = this;
            if (item.value == self.channel) return;
            let index = self.playlist.indexOf(item.value);
            if (index != -1) return self.$Message.warning("视频资源被占用");
            let i = self.playlist.indexOf(self.channel);
            //先停止
            self.close();
            self.channel = item.value;
            self.isFirst = true;
            self.$emit("change-channel", i, self.channel);
        },
        playVideo () {
            const self = this;
            if (!self.id) return;
            this.playControl(0).then((url) => {
                // 增加是否初始化状态校验，防止接口延迟导致初始化状态开始播放
                if (url.indexOf("http") != -1 && !self.isFirst) self.initialize(url);
            });
        },
        initialize (url) {
            const self = this;
            self.myPlayer = videojs(self.node, {
                "controls": false,
                "preload": "auto",
                "defaultMuted": true,
                "techOrder": ["html5"]
            }, function() {
                let myPlayer = this;
                myPlayer.src({
                    "src": url,
                    "type": "application/x-mpegURL"
                });

                myPlayer.play();
                self.changeVolume(self.volume);

                myPlayer.on("timeupdate", () => {
                    let currentTime = myPlayer.currentTime();
                    // console.log(currentTime);
                    self.curTime = parseInt(currentTime * 1000) + self.startTime;
                    if (currentTime > 0) self.$emit("on-ready", self.curTime);
                    // self.current();//进度计时
                });

                self.url = url;
                self.startHeatBeat();
            });
            self.myPlayer.off("error");
            self.myPlayer.on("error", () => {
                clearTimeout(self.replay);
                self.replay = setTimeout(() => {
                    self.myPlayer.src({
                        "src": self.url,
                        "type": "application/x-mpegURL"
                    });
                    self.myPlayer.play();
                }, 3000);
            });
        },
        startHeatBeat () {
            const self = this;
            clearInterval(self.timer);
            self.timer = setInterval(() => {
                yd.ajax({
                    "url": "../apiprovince/video/replay/heartbeat",
                    "data": {
                        "url": self.url,
                        "replaySessionId": md5(localStorage.getItem("token"))
                    },
                    success (result) {
                        // 视频回放时间已结束
                        if (result == "ResultCode_00010"){
                            clearInterval(self.timer);
                            try {
                                self.myPlayer.pause();
                            } catch (err){
                                console.error(err);
                            }
                            self.isFirst = true;
                            self.isPlay = false;
                        }
                    },
                    error (msg){
                        console.error("heartbeat failed." + msg);
                    }
                });
            }, 5000);
        },
        playControl (commandType = 2) {
            const self = this;
            if (!self.id) return;
            if (commandType == 2) clearInterval(self.timer);
            self.cancel();
            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();
            self.source = source;
            return new Promise((resolve, reject) => {
                yd.ajax({
                    "url": "../apiprovince/video/replay",
                    "cancelToken": source.token,
                    "data": {
                        "replaySessionId": md5(localStorage.getItem("token")),
                        "videoReplayDayId": self.id, // 历史回放资源ID
                        "vehicleId": parseInt(self.vehicleId),
                        "commandType": commandType, // "下发指令类型
                        "startTime": self.startTime // "播放开始时间
                    },
                    // "dataType": "text",
                    success (json) {
                        const msg = errorMsg[json];
                        if (msg && msg != "成功") {
                            self.msg = msg;
                            self.isOccupancy = true;
                            self.isFirst = false;
                        }
                        resolve(json);
                    },
                    error () {
                        reject();
                    }
                });
            });

        },
        checkFull () {
            // let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            let isFull = document.mozFullScreen||
                        document.fullScreen ||
                        //谷歌浏览器及Webkit内核浏览器
                        document.webkitIsFullScreen ||
                        document.webkitRequestFullScreen ||
                        document.mozRequestFullScreen ||
                        document.msFullscreenEnabled;
            //to fix : false || undefined == undefined
            if (isFull === undefined) {
                isFull = false;
            }
            return isFull;
        },
        close (callBack) {
            const self = this;
            self.isPlay = false;
            self.isFirst = false;
            self.playControl(2).then(() => {
                if (callBack) callBack();
            });
        },
        captureScreen () {
            const self = this;
            // let scale = 1;
            let canvas = document.createElement("canvas");
            let video = document.getElementById(self.node+"_html5_api");
            if (!video) return "";
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            let blank = canvas.toDataURL();
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            let src = canvas.toDataURL("image/png");
            if (src == blank) return "";//过滤空白图片
            let img = document.createElement("img");
            img.src = src;
            img.title = self.curTime;
            canvas.toDataURL("image/png");
            return img.src != "data:," ? img : "";
        },
        cancel () {
            const self = this;
            if (self.source) self.source.cancel("Operation canceled by the user.");
        }
    }
};
</script>