<template>
    <Modal class="bigScreenModal" draggable scrollable v-model="modal" :width="424" footer-hide :style="{'top':'0px','left':'0px'}">

    <div class="title" slot="header">{{vehicleData.carLicense}}
            <div v-show="vehicleData.waybillNo" class="modalbtn" @click="loadLine">路线轨迹比对</div>
        </div>
        <div>企业：{{vehicleData.companyName}}</div>
        <div>速度：{{vehicleData.speed}}km/h</div>
        <div>地理位置：{{address}}</div>
        <ul class="modaltab" v-show="vehicleData.waybillNo">
            <li @click="tab='tab1'" :class="tab=='tab1'?'on':''">实时视频</li>
            <li @click="tab='tab2'" :class="tab=='tab2'?'on':''">报警信息</li>
            <li @click="tab='tab3'" :class="tab=='tab3'?'on':''">单证详情</li>
        </ul>

        <div class="videoWrap" v-show="tab=='tab1'">
            <ul class="videoList clearfix">
                <li class="fl videoPlayWindow pr" v-for="(video, index) in vehicle.videoList"
                    :key="`${vehicle.vehicleId}_${video.channel}_${index}`"
                    style="width: 50%;height: calc(100% - 21px);">
                    <live-video preload :data="video" :token="token" @on-end="end" ref="liveVideo"></live-video>
                </li>
            </ul>
        </div>
        <div v-show="tab=='tab2'" class="tab2">
            <div v-if="Object.keys(alarmMsg).length">
                <div>报警类型：{{ alarmMsg.alarmTypeText}}</div>
                <div>报警时间：{{ new Date(alarmMsg.alarmTime).Format("yyyy-MM-dd hh:mm:ss")}}</div>
                <div>报警速度：{{ alarmMsg.speed}} km/h</div>
                <div>报警地点：{{alarmMsg.address}}
                    <Tooltip content="查看位置" placement="bottom">
                        <div class="alarm" @click="addAlarm" :class="showAlarm?'on':''"><i
                                class="iconfont icon_sp_baoj"></i></div>
                    </Tooltip>
                </div>
                <div>处理状态：<span :style="{'color': alarmMsg.handleStatus?'#47F132':'#FC283D' }">{{alarmMsg.handleStatusText}}</span>
                </div>
                <div>处理时间：{{alarmMsg.handleStatus?new Date(alarmMsg.alarmTime).Format("yyyy-MM-dd hh:mm:ss"):"--"}}
                </div>
                <div>处理人：{{ alarmMsg.handleOperator||"--"}}</div>
            </div>
            <div  v-else class="noData" style="height: 100%">
                <div class="noDataText">
                    <i class="iconfont icon_no_data"></i> <br>
                    暂无数据
                </div>
            </div>
        </div>
        <div v-show="tab=='tab3'" class="tab2">
            <div class="title">途中监管单</div>
            <div>途中监管单号：{{ vehicleData.waybillNo}}</div>
            <div>转入地卡口放行单：{{waybillMsg.in_LCP_GUID}}</div>
            <div>转出地卡口放行单：{{waybillMsg.out_LCP_GUID}}</div>
            <div>录入人：{{waybillMsg.full_NAME}}</div>
            <div>录入时间：{{waybillMsg.add_DATE}}</div>
            <div v-for="item in goodsMsg" :key="item">
                <div class="title">核放单详情</div>
                <div>核放单号：{{item.pass_NO}}</div>
                <div>核放单状态：{{item.link_STATUS_NAME}}</div>
                <div>申报企业：{{item.agent_NAME}}</div>
                <div>业务类型：{{item.biz_TYPE_NAME}}</div>
                <div>货物类型：{{item.goods_TYPE_NAME}}</div>
                <div>放行状态：{{item.lcp_PASS_STATUS_NAME}}</div>
                <div>到货状态：{{item.arrive_STATUS_NAME}}</div>
                <div>出入库状态：{{item.store_STATUS_NAME}}</div>
                <div>理货状态：{{item.tally_STATUS_NAME}}</div>
                <div>件数：{{item.pack_NO}} 件</div>
                <div>重量：{{item.gross_WT}} KG</div>
            </div>

        </div>
    </Modal>
</template>

<script>
import * as yd from "@/libs/yd";
import customModalBase from "_m/customModalBase";
import liveVideo from "./live-video";
import * as SubConfig from "@/libs/SubConfig";


export default {
    "name": "vehicleDetailModal",
    "mixins": [customModalBase],
    "components": {
        "live-video": liveVideo
    },
    "props": {
        "vehicleData": {
            "type": Object,
            "default": {}
        }, "token": {
            "type": String,
            "default": ""
        }
    },
    data() {
        return {
            "address": "",
            "vehicle": {"vehicleId": "", "channel": "", "videoList": []},
            "tab": "tab1",
            "alarmMsg": {},
            "waybillMsg": {},
            "goodsMsg": [],
            "showAlarm": false,
            "showLine": false
        };
    },
    "watch": {
        "modal": function (val) {
            const self = this;
            self.vehicleData.address = "";
            if (val) {
                if (self.vehicleData.waybillNo) {
                    self.loadAlarm();
                    self.loadWayBillMsg();
                }
                yd.getLocation({
                    "lat": self.vehicleData.gpsLat,
                    "lng": self.vehicleData.gpsLng
                },
                function (address) {
                    Vue.set(self, "address", address ? address : "此位置无法解析");
                });
                self.render(self.vehicleData);

            } else {
                self.end();
                self.init();
            }
        }

    },
    mounted() {
    },
    "methods": {
        init() {
            const self = this;
            self.tab = "tab1";
            self.showAlarm = false;
            self.showLine = false;
            self.$emit("add-line", {
                "vehicleId": self.vehicleData.vehicleId,
                "flag": self.showLine
            });
            self.$emit("add-alarm", {
                "lat": self.alarmMsg.gpsLat,
                "lng": self.alarmMsg.gpsLng,
                "title": self.alarmMsg.alarmTypeText,
                "flag": self.showAlarm
            });
        },
        render(item) {
            const self = this;
            let list = [];
            [2, 4].forEach((channel, index) => {
                let obj = {
                    "channel": channel,
                    "channelLabel": SubConfig.videoChannel[channel],
                    "steam": 1,
                    "steamLabel": "子码流",
                    "flag": item.simCardNo ? false : true,
                    "node": "infowindow_" + item.vehicleId + "_" + index,
                    "isFirst": item.simCardNo ? true : false,
                    "volume": 0,
                    "isFullScreen": false,
                    //全屏
                    "msg": item.simCardNo ? "该通道暂无视频" : "该车辆未查询到sim卡号",
                    "channelList": [],
                    "simCardNo": item.simCardNo,
                    "vehicleId": item.vehicleId
                };
                if (item.channel.indexOf(channel) == -1) {
                    obj.channel = 0;
                    obj.isFirst = false;
                    obj.msg = "该通道暂无视频";

                }
                list.push(obj);
            });

            self.vehicle = {
                ...item,
                "videoList": list
            };

        },
        end() {
            const self = this;
            const liveVideos = self.$refs.liveVideo || [];
            liveVideos.forEach((item) => {
                item.stop();
            });

        },
        loadAlarm() {
            const self = this;
            self.alarmMsg = {};
            yd.ajax({
                "url": "/apiprovince/vehicleAlarm/selectVehicleAlarmExtendPage",
                "type": "POST",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "pageNo": 1,
                    "pageSize": 1,
                    "startTime": new Date(new Date().Format("yyyy/MM/dd 00:00:00")).getTime(),
                    "endTime": new Date().getTime(),
                    "vehicleId": self.vehicleData.vehicleId
                },
                success(json) {
                    self.alarmMsg = json.list[0] || {};
                    if (Object.keys(self.alarmMsg).length == 0) {
                        return;
                    }
                    ;
                    self.alarmMsg.alarmTypeText = SubConfig.alarmType[self.alarmMsg.alarmType] || "";
                    self.alarmMsg.handleStatusText = SubConfig.handleStatus[self.alarmMsg.handleStatus];
                    yd.getLocation({
                        "lat": self.alarmMsg.gpsLat,
                        "lng": self.alarmMsg.gpsLng
                    },
                    function (address) {
                        Vue.set(self.alarmMsg, "address", address ? address : "此位置无法解析");
                    });
                }
            });
        },
        addAlarm() {
            const self = this;
            self.showAlarm = !self.showAlarm;
            self.$emit("add-alarm", {
                "lat": self.alarmMsg.gpsLat,
                "lng": self.alarmMsg.gpsLng,
                "title": self.alarmMsg.alarmTypeText,
                "flag": self.showAlarm
            });
        },
        loadLine() {
            const self = this;
            self.showLine = !self.showLine;
            if (!self.waybillMsg.add_DATE){
                return self.$Message.error("暂无单证录入时间数据！");
            }
            self.$emit("add-line", {
                "vehicleId": self.vehicleData.vehicleId,
                "startTime": new Date(self.waybillMsg.add_DATE).getTime(),
                "flag": self.showLine
            });
        },
        loadWayBillMsg() {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/waybill/getPassGoodsInfo",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "waybillNo": self.vehicleData.waybillNo
                },
                success(json) {
                    self.waybillMsg = json;
                    if (json.lcp_S.guid) {
                        self.loadGoodsMsg(json.lcp_S.guid, "lcp_S");
                    }
                    if (json.lcp_E.guid) {
                        self.loadGoodsMsg(json.lcp_E.guid, "lcp_E");
                    }
                }
            });
        },
        loadGoodsMsg(guId, type) {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/waybill/getGoodsPage",
                "headers": {
                    "Authorization": self.token
                },
                "data": {
                    "guId": guId
                },
                success(json) {
                    if (self.goodsMsg.length == 0) {
                        self.goodsMsg = json;
                    } else {
                        var arr = JSON.parse(JSON.stringify(self.goodsMsg));
                        arr = arr.concat(json);
                        self.goodsMsg = arr;
                    }
                }
            });
        }
    }
};
</script>

<style scoped>

</style>