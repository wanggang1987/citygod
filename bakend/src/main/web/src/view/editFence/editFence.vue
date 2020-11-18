<template>
<div class="contents grey_b">
    <div class="content clearfix editFence">
        <div class="stepMenu pb8">
            <Steps :current="current">
                <Step title="绘制围栏"></Step>
                <Step title="围栏信息设置"></Step>
            </Steps>
        </div>
        <div class="addFenceWap">
            <div class="drawMap pr" v-show="current==0">
                <i-input class="pa" placeholder="请输入城市名...如：‘无锡’" style="width: 210px;top: 12px;left: 12px;z-index: 999;" element-id="cityMap"></i-input>
                <div class="pa tac br" v-show="model" style="top: 53px;right: 5px;z-index: 999;width: 195px;line-height: 30px;background: red;color: #fff;">绘制多边形以双击结束</div>
                <div id="map" @click="clickMap" :style="{'height' : mapHeight + 'px'}"></div>
                <div class="pa bg fs12 br mapToolList" style="top: 90px;right: 4px;">
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
            <Row class="zoneName pt32" v-show="current == 1">
                <Row>
                    <i-col span="4" class="tit">围栏名称</i-col>
                    <i-col span="20">
                        <i-input v-model="zoneName" maxlength="100"></i-input>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="4" class="tit">单证类型</i-col>
                    <i-col span="20">
                        <documentTypeTreeSelect v-model="documentType"></documentTypeTreeSelect>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="4" class="tit">状态</i-col>
                    <i-col span="20">
                        <RadioGroup v-model="status">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">禁用</Radio>
                        </RadioGroup>
                    </i-col>
                </Row>
            </Row>
        </div>
        <div class="stepBtn pt12 tac">
            <i-button class="mr8" v-show="current" @click="back">上一步</i-button>
            <i-button v-show="!current" type="primary" @click="next">下一步</i-button>
            <i-button v-show="current" type="primary" @click="save">保存</i-button>
        </div>
    </div>
</div>
</template>

<script src="./editFence.js"></script>