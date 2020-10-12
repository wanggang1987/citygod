<template>
<div class="card">
    <div class="caption">
        <span class="icon icon4"></span>实时异常推送
    </div>
    <div class="pane pl24 pr24 pt24 pb24 oh" style="height: calc(100% - 51px);">
        <div class="oh" style="height: 100%;">
        <transition name="slide">
            <Timeline class="abnormalPush" v-show="flag">
                
                <TimelineItem v-for="item in list" color="#fff" :key="item.id">
                    <div class="pa tac alarmTime">
                        {{ item.time }}
                    </div>
                    <p><span class="alarmType mr16 dib" :style="{ 'border-color': item.color }">{{ item.alarmType }}</span>{{ item.carLicense }}</p>
                    <p style="opacity: 0.8;">{{ item.address }}</p>
                </TimelineItem>

            </Timeline>
        </transition>
            <div v-show="!list.length" class="noData" style="height: 100%">
                <div class="noDataText">
                    <i class="iconfont icon_no_data"></i> <br>
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";

export default {
    "name": "abnormalPush",
    "props": {
        "token": {
            "type": String
        }
    },
    data () {
        return {
            "list": [],
            "timer": "",
            "color": {
                "40001": "#FF2323",
                "40002": "#FFDE00",
                "40003": "#FF6C00"
            },
            "flag": false
        };
    },
    mounted () {
        this.render();
        window.vm=this;
    },
    "methods": {
        render () {
            const self = this;
            self.query((json = []) => {
                if (!json.length) return;
                let arr = [];
                json.forEach((item) => {
                    arr.push(self.getLocation(item));
                });
                Promise.all(arr).then((list) => {
                    self.flag = false;
                    setTimeout(() => {
                        self.list = list;
                        self.flag = true;
                    }, 2100);
                }).catch((error) => {
                    self.list = [];
                });
            });
        },
        query (callBack) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/bigScreen/selectAlarmPushInfo",
                "headers": { 
                    "Authorization": self.token// 请求头                                              
                },
                success (json) {
                    self.refresh();
                    callBack(json);
                },
                error () {
                    callBack();
                }
            });
        },
        refresh () {
            const self = this;
            clearTimeout(self.timer);
            self.timer = setTimeout(() => {
                self.render();
            }, 30000);
        },
        getLocation (item) {
            const self = this;
            return new Promise((resovle, reject) => {
                yd.getLocation({
                    "lat": item.gpsLat,
                    "lng": item.gpsLng
                }, (address) => {
                    const obj = {
                        "id": item.id,
                        "time": new Date(item.alarmTimeLong).Format("hh:mm"),
                        "alarmType": SubConfig.alarmType[item.alarmType],
                        "color": self.color[item.alarmType],
                        "carLicense": item.carLicense,
                        "address": address || "未知"
                    };
                    resovle(obj);
                });
            });
        }
    }
};
</script>