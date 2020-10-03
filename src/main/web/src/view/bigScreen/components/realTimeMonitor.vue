<template>
<div class="card">
    <div class="caption">
        <span class="icon icon1"></span>实时监控
        <Icon class="pa cursor" custom="iconfont icon_refresh" @click="init" style="background: #2045CD;width: 24px;line-height: 24px;right: 24px;"/>
    </div>
    <div class="pane pl12 pr24 pt12" style="height: calc(100% - 50px)">
        <div class="ivu-row videoWrap" style="height: 100%">
            <div class="ivu-col ivu-col-span-8" v-for="item in videoList" :key="item.vehicleId" style="height: 100%;">
                <div class="tac mb4" style="color: #F9F9F9;">
                    <span class="dib" style="width:160px;height:20px;background:rgba(249,249,249,.1);border-radius:10px;">
                        {{ item.carLicense }}
                        <span class="ml24"><span class="dib mr8 br" style="width: 10px;height: 10px;" :style="{'background': item.ifHasNoHandleAlarm ? '#B3261A' : '#18DB47'}"></span>{{ item.ifHasNoHandleAlarm ? '异常' : '正常'}}</span>
                    </span>

                </div>
                <ul class="videoList clearfix">
                    <li class="fl videoPlayWindow pr" v-for="(video, index) in item.list" :key="`${item.vehicleId}_${video.channel}_${index}`" style="width: 50%;height: calc(100% - 21px);">
                        <live-video preload :data="video" :token="token" @on-end="end" ref="liveVideo"></live-video>
                    </li>
                </ul>
            </div>
            <div v-show="!videoList.length" style="height: 100%;display:flex">
                <div class="tac ma" style="align-self:center;">
                    <img :src="vehicleNotOnline" style="width: 100px;height: 100px;" />
                    <p class="mt20 fs18" style="color: #ccc;">车辆不在线</p>
                </div>
            </div>
            
        </div>
    </div>
</div>
</template>

<script>
import * as yd from "@/libs/yd";
import liveVideo from "./live-video";
import vehicleNotOnline  from "@/assets/images/bigScreen/vehicleNotOnline.png";

export default {
    "name": "RealTimeMonitor",
    "components": {
        "live-video": liveVideo
    },
    "props": {
        "token": {
            "type": String
        }
    },
    data () {
        return {
            "vehicleNotOnline": vehicleNotOnline,
            "videoList": [],
            "num": 0,
            "timer": "",
            "flag": false
        };
    },
    mounted () {
        this.init();
    },
    "methods": {
        init () {
            const self = this;
            self.num = 2;
            self.query();
        },
        query () {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/bigScreen/getMonitorVehicles",
                "headers": { 
                    "Authorization": self.token// 请求头                                              
                },
                success (json) {
                    self.videoList = [];
                    self.$nextTick(() => {
                        self.render(json);
                    });
                    
                }
            });

        },
        render (json = []) {
            const self = this;
            let videoList = [];
            json.forEach((item, i) => {
                let list = [];
                [2, 4].forEach((channel, index) => {
                    let obj = {
                        "channel": channel,
                        "channelLabel": "通道"+channel,
                        "steam": 1,
                        "steamLabel": "子码流",
                        "flag": item.simCardNo ? false: true,
                        "node": "video_"+ item.vehicleId + "_" + index,
                        "isFirst": item.simCardNo ? true: false,
                        "volume": 0,
                        "isFullScreen": false,
                        //全屏
                        "msg": item.simCardNo ? "该通道暂无视频": "该车辆未查询到sim卡号",
                        "channelList": [],
                        "simCardNo": item.simCardNo,
                        "vehicleId": item.vehicleId
                    };
                    if (item.channel.indexOf(channel) == -1) {
                        obj.channel = 0;
                        obj.isFirst = false;

                    }
                    list.push(obj);
                });


                videoList.push({
                    ...item,
                    "list": list
                });
            });
            self.videoList = videoList;
            self.flag = false;

        },
        end () {
            const self = this;
            if (self.flag) return;
            self.flag = true;
            if (self.num) {
                self.num --;
                self.query();
            } else {
                const liveVideos = self.$refs.liveVideo || [];
                liveVideos.forEach((item) => {
                    item.stop();
                });
            }

        }
    }


};
</script>