<template>
<div class="contents grey_b" style="padding: 6px">
    <div class="fl pt8 pb8 pl12" style="height: 100%;width: 272px;padding: 6px">
        <div style="height: 100%;padding: 12px;" class="bg">
            <div style="height: calc(100% - 36px);">
                <div class="provnceTreeWap">
                    <tree-selector @on-check-change="getVehicles" :checkable="true" :type="type" ></tree-selector>
                </div>
            </div>
            <div  style="height: 36px;">
                <div class="provnceTreeWap">
                    <Row>
                        <i-col span="24">
                            <!--<div class="se" >-->
                                <!--<i v-show="!isPlay" class="iconfont icon_all_start handClick fs32" @click="playControl" ></i>-->
                                <!--<i v-show="isPlay" class="iconfont icon_all_zt handClick fs32" @click="playControl" ></i>-->
                                <!--<div v-show="!isPlay" style="">全部开始</div>-->
                                <!--<div v-show="isPlay" style="">全部暂停</div>-->
                            <!--</div>-->
                            <i-button type="primary" @click="playControl('start')" :disabled="!checkVehicle" style="margin-right: 14px">
                                <i class="iconfont icon_all_start" style="font-size: 18px;margin-right: 6px;position: relative;top: -1px"></i>全部开始</i-button>
                            <i-button type="primary" @click="playControl('stop')" :disabled="!checkVehicle">
                                <i class="iconfont icon_all_zt" style="font-size: 18px;margin-right: 6px;position: relative;top: -1px"></i>全部停止</i-button>
                        </i-col>

                    </Row>

                </div>
            </div>
        </div>

    </div>
    <div class="fl" style="height: 100%;width:calc(100% - 272px);padding: 6px">
        <div class="bg" style="height: 100%">
            <div v-if="checkVehicle" style="height: 100%;overflow-y: auto" class="manyVideoWrap" >
                <div v-for="item in videoList"  class="videoWrap " style="width:100%;" :style="{'height':videoList.length==1?'100%':'33%'}">
                    <div style="font-size:14px;color:#333;line-height:19px;padding: 0 12px 6px">{{item.carLicense}}</div>
                    <ul class="videoList clearfix">
                        <li class="fl videoPlayWindow pr" v-for="video in item.videoList" style="margin: 0 2px" :style="{'height': videoList.length==1?'50%': 'calc(100% - 25px)','width': videoList.length==1?'calc(50% - 4px)':'calc(25% - 4px)'}">
                            <live-video  :playflag="playTag" :stopflag="stopTag" :data="video"></live-video>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else style="height: 100%;width: 100%" class="manyVideoWrap">
                <div style="width: 270px;height: 250px;position: absolute;left: 0;right: 0;bottom: 0;top: 0;margin: auto;">
                    <div style="width: 130px;height: 130px;background: #E9E9E9;border-radius: 50%;text-align: center;line-height: 130px;margin: 0 auto">
                        <svg class="vam" aria-hidden="true" style="width: 95px;height: 130px;">
                            <use xlink:href="#icon_car_prompt"></use>
                        </svg>
                    </div>
                    <div style="font-size:14px;text-align: center;color: #333;line-height: 20px;margin-bottom: 24px;;margin-top: 12px;">请在左侧选择可播放车辆</div>
                    <div style="width: 270px;font-size: 14px;color: #555;line-height: 20px;margin-bottom: 4px;">
                        <Icon type="ios-help-circle-outline" style="font-size: 16px;margin-right: 3px;" />说明 <br>
                    </div>
                    <div style="width:270px;font-size:14px;color:#555;line-height:20px;">
                        1、最多支持选择6辆车<br> 2、视频支持播放60s，可点击开始继续观看
                    </div>
                </div>


            </div>
        </div>

    </div>
</div>
</template>

<script src="./realTimeMonitor.js"></script>