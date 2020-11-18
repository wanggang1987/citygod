<template>
<div class="contents grey_b">
    <div class="clearfix p12 videoPlayBack" style="height: 100%;">
        <div class="br bg fl p8 mr12" style="width: 260px;height: 100%;">
            <vehicleTree ref="tree" :type="3" @on-select-change="selectChange" style="height: calc(100% - 214px);"></vehicleTree>
            <div class="mt8 pr">
                <loading-spining v-model="spinShow"></loading-spining>
                <date-panel v-model="date" :hasdata="playData" @on-change="changeDate" @on-click-one="checkedDate"></date-panel>
            </div>
        </div>
        <div class="playBackSwap bg br fl" style="height: 100%;width: calc(100% - 272px);">

            <div class="videoWrap" style="height: calc(100% - 188px)">
                <ul v-show="videoList.length" class="videoList clearfix">
                    <li class="fl videoPlayWindow pr" v-for="(item, index) in videoList" :key="index" :style="videoListStyle">
                        <video-play-back ref="liveVideo" :data="item" :playlist="playList" @change-channel="changeChannel" @on-ready="onReady"></video-play-back>
                    </li>
                </ul>
                <div v-show="!videoList.length" class="videoList" style="background: #333;display: flex;align-items: center;justify-content: center;margin-left: 6px;">
                    <div class="tac">
                        <span class="dib" style="width: 130px;line-height: 130px;border-radius: 50%;background: #E9E9E9;">
                            <svg class="vam" aria-hidden="true" style="width: 100px;height: 100px;">
                                <use xlink:href="#icon_car_prompt"></use>
                            </svg>
                        </span>
                        <p class="mt12 fs14 white">请选择可播放视频的车辆</p>
                    </div>
                </div>
            </div>

            <div class="mr12 mb12 ml12" style="height: 176px;border:1px solid #ccc;">
                <div class="clearfix fs14" style="padding:3px 8px;border-bottom:1px solid #F0F0F0;background-color: #F0F2F5">
                    <label class="dib vam">视频数：</label>
                    <radio-group @on-change="changeNum" v-model="videoNum">
                        <radio :label="1">单个</radio>
                        <radio :label="6">全部</radio>
                    </radio-group>
                    <label class="dib vam ml20">码流：</label>
                    <radio-group v-model="steam">
                        <radio :label="item.value" v-for="item in steamList" :key="item.value">{{ item.label }}</radio>
                    </radio-group>
                    <Tooltip class="ml20 vam" :content="voiceFlag ? '关闭声音' : '开启声音'">
                        <a class="iconfont fs20 cursor" :class="voiceFlag ? 'icon_sound_open' : 'icon_sound_close'" @click="closeViose(!voiceFlag)"></a>
                    </Tooltip>
                    <Tooltip class="ml20 vam" content="视频下载">
                        <a class="iconfont icon_video fs20 cursor" @click="crop"></a>
                    </Tooltip>
                    <Tooltip class="ml20 vam" content="截图">
                        <a class="iconfont icon_screenshot fs20 cursor" @click="screenshot"></a>
                    </Tooltip>
                    <!-- <i-button class="ml20" size="small" type="primary" custom-icon="iconfont icon_all_start" @click="startPlay">开始播放</i-button> -->
                </div>
                <div style="width:100%" :style="{'height': progressHeight + 'px'}">
                    <div id="progress" @click="clickProgress" style="height: 100%"></div>
                </div>
            </div>

            <!-- 视频裁剪start -->
            <CropVideo v-model="showFlag" :vehicle-id="vehicleId" :data="videoBackMap" :day="time"></CropVideo>
            <!-- 视频裁剪end -->
        </div>
        <!-- </div> -->
    </div>
</div>
</template>

<script src="./videoPlayBack.js"></script>