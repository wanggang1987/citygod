<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="500" footer-hide :mask-closable="false">
    <div slot="header" class="pr header">车辆管理<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <div class="mainBody">
        <div class="clearfix ivu-row">
            <div class="clearfix mb16">
                <span class="fl caption tar" style="width: 100px;">车牌号：</span>
                <div class="detail">{{ carLicense }}</div>
            </div>
            <div class="clearfix mb16">
                <span class="fl caption tar" style="width: 100px;">车牌颜色：</span>
                <div class="detail">{{ plateColor }}</div>
            </div>
            <div class="clearfix mb16">
                <span class="fl caption tar" style="width: 100px;">企业名称：</span>
                <div class="detail">{{ companyName }}</div>
            </div>
            <div class="clearfix mb16">
                <span class="fl caption tar" style="width: 100px;">SIM卡号：</span>
                <div class="detail">{{ simCardNo }}</div>
            </div>
            <div class="clearfix mb16">
                <span class="fl caption tar" style="width: 100px;">通道号：</span>
                <div class="detail">{{ channel }}</div>
            </div>
        </div>
    </div>
    <div slot="footer" class="footer">
        <i-button @click="cancel">取消</i-button>
        <i-button type="primary" :loading="loading" @click="ok">确定</i-button>
    </div>
</Modal>
</template>

<script>
import * as yd from "@/libs/yd";
import customModalBase from "_m/customModalBase";
import * as SubConfig from "@/libs/SubConfig";

export default {
    "name": "vehicleDetail",
    "mixins": [customModalBase],
    "props": {
        "data": {
            "type": Object,
            "default": () => {
                return {};
            }
        }
    },
    data () {
        return {
            "carLicense": "", // 车牌号
            "plateColor": "", // 车牌颜色
            "companyName": "", // 企业名称
            "simCardNo": "", // SIM卡号
            "channel": "" // 通道号
        };
    },
    "methods": {
        init () {
            const self = this;
            self.render(self.data); 
        },
        render (json = {}) {
            const self = this;
            self.carLicense = json.carLicense;
            self.plateColor = SubConfig.plateColor[json.plateColor];
            self.simCardNo = json.simCardNo;
            const channels = json.channel.split(",");
            const channel = channels.map((item) => {
                return SubConfig.videoChannel[item];
            });
            self.channel = channel.toString();
            self.companyName = json.enterpriseName; // 企业名称
        }
    }
};
</script>