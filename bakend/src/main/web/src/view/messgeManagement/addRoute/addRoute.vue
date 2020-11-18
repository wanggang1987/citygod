<template>
    <div class="contents grey_b">
        <div class="content clearfix routePage" style="height:calc(100% - 24px)">
            <div class="stepMenu editFence">
                <Steps :current="stepCurrent">
                    <Step title="绘制行驶路线"></Step>
                    <Step title="行驶路线信息设置"></Step>
                </Steps>
            </div>
            <div class="drawMap" v-show="stepCurrent==0">
                <!--<div v-show="textShow"  style="position: absolute;top: 53px;right: 5px;z-index: 999;width: 297px;line-height: 30px;background: red;text-align: center;border-radius: 4px;color: #fff;">提示：绘制路线最大点数为30。（超过将截取）</div>-->
                <div class="panel" :class="routeTypes.length?'search':''">
                    <i-input v-model="startPoint" placeholder="请输入起点"></i-input>
                    <i-input v-model="endPoint" placeholder="请输入终点" style="margin-top: 12px"></i-input>
                    <i-button @click="searchRoute" type="primary" style="width:100%;margin-top: 12px">查询</i-button>
                    <div v-show="routeTypes.length" style="padding-top:12px;height: calc(100% - 120px);">
                        <RadioGroup v-model="routeType" type="button" @on-change="changeRouteType" size="small">
                            <Radio v-for="item in routeTypes" :label="item.type" :key="item.type">{{item.name}}</Radio>
                        </RadioGroup>
                        <div id="r-result"></div>
                    </div>

                </div>
                <div id="map" style="height: 100%;width: 100%"></div>
                <div class="pa bg fs12 br mapToolList" style="top: 60px;right: 12px;">
                    <!-- 地图类型切换 start -->
                    <i-button class="mapType db" :class="{'active': mayTypeFlag}" type="text" @click="changeMapType">
                        <Icon custom="iconfont icon_satellite" />
                        卫星
                    </i-button>
                    <!-- 地图类型切换 end -->
                    <!-- 地图类型切换 start -->
                    <i-button class="distanceTool db" type="text" @click="openDistanceTool">
                        <Icon custom="iconfont icon_ranging" />
                        测距
                    </i-button>
                    <!-- 地图类型切换 end -->
                </div>
            </div>
            <div class="zoneName" v-show="stepCurrent==1">
                <Row style="padding-top: 10vh">
                    <i-col span="8" class="tit">行驶方向：</i-col>
                    <i-col span="16">
                        <i-select v-model="fromCode" style="width: 150px">
                            <i-option v-for="item in fromZoneList" :value="item.value" :key="item.value">{{item.label}}</i-option>
                        </i-select>
                        至
                        <i-select v-model="toCode" style="width: 150px">
                            <i-option v-for="item in fromZoneList" :value="item.value" :key="item.value" :disabled="fromCode==item.value">{{item.label}}</i-option>
                        </i-select>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8" class="tit">行驶路线名称</i-col>
                    <i-col span="16">
                        <i-input v-model="zoneName" maxlength="100"></i-input>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8" class="tit">单证类型</i-col>
                    <i-col span="16">
                        <documentTypeTreeSelect v-model="documentType"></documentTypeTreeSelect>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8" class="tit">规定时间</i-col>
                    <i-col span="16">
                        <i-select v-model="timeType" style="width: 60px">
                            <i-option value="1">分</i-option>
                            <i-option value="60">时</i-option>
                        </i-select>
                        <input-number v-model="time" :max="9999" :min="1"
                                      style="width: 100px;margin-left: 12px;"></input-number>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8" class="tit">状态</i-col>
                    <i-col span="16">
                        <RadioGroup v-model="status">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">禁用</Radio>
                        </RadioGroup>
                    </i-col>
                </Row>
            </div>
            <div style="text-align: center;padding-top: 15px">
                <i-button v-show="stepCurrent>0" type="ghost" @click="stepCurrent--">上一步</i-button>
                <i-button v-show="stepCurrent<1" type="primary" @click="next">下一步</i-button>
                <i-button v-show="stepCurrent>0" type="primary" style="margin-left: 24px" @click="goRouteManage">保存
                </i-button>
            </div>

        </div>
    </div>
</template>

<script src="./addRoute.js"></script>
