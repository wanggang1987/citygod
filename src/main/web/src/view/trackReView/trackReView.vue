<template>
<div class="contents grey_b">
    <div class="trackReview clearfix p12">
        <Row style="height: 100%">
            <div style="display:inline-block;width: 260px;height: 100%;">
                <div class="trackTree pr" style="height:100%;overflow: auto;">
                    <div style="font-size: 12px;color: #5A5A5A;height: 16px;margin-bottom: 8px">* 注：支持查看连续7天运行轨迹</div>
                    <div class="clearfix">
                        <tree-selector :defaults="defaultVehicleIds" @on-select-change="selectChange" class="fl" :type="3" @on-ready="onReady"></tree-selector>
                    </div>
                    <Row class="trackReviewmt16" >
                        <date-picker @on-change="startTimeChange" :editable="false" :clearable="false" type="datetime" v-model="startTime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></date-picker>
                    </Row>
                    <Row class="trackReviewmt16" >
                        <date-picker :editable="false" @on-change="changeTime" :clearable="false" type="datetime" v-model="endTime" format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></date-picker>
                    </Row>
                    <Row class="trackReviewmt16" >
                        <checkbox v-model="retransmittedFlag" style="color:#333333;">&nbsp;展示补传数据</checkbox>
                    </Row>
                    <Row class="trackReviewmt16" >
                        <i-button  @click="search" type="primary" :disabled="searchCurrentStartTime==0?false:true" style="width:100%;background-color: #2059ef">查询</i-button>
                    </Row>

                    <Row class="trackReviewmt40 mt12">
                        <div style="font-size: 12px;color: #5A5A5A;height: 16px;margin-bottom: 8px">
                            <span style="display: inline-block;width: 6px;height: 6px;background: #00A854;position: relative;top: -1px;"></span>
                            显示为有运行轨迹的日期</div>
                        <div class="trackCalendar">
                            <div class="calendar" v-for="(item, index) in calendarList" :key="index">
                                <div>
                                    <div class="calendar_title">
                                        <i-button type="text" @click="prevMonth"><i class="ivu-icon ivu-icon-ios-arrow-back"></i></i-button>
                                        {{item.curYear}}年<span>{{item.curMonth}}月</span>
                                        <i-button type="text" @click="nextMonth"><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></i-button>

                                    </div>
                                    <div class="sign_cal">
                                        <div class="sign_row clearfix"><div class="th_1 fwb fl">日</div>
                                            <div class="th_2 fwb fl">一</div>
                                            <div class="th_3 fwb fl">二</div>
                                            <div class="th_4 fwb fl">三</div>
                                            <div class="th_5 fwb fl">四</div>
                                            <div class="th_6 fwb fl">五</div>
                                            <div class="th_7 fwb fl">六</div>
                                        </div>
                                        <div class="sign_row clearfix" v-for="(week, index) in item.dates" :key="index">
                                            <template v-for="day in week">

                                                <div :key="day.date.getDate()" class="calendar_record" :class="{'otherMonth': (day.date.getMonth()+1)!=item.curMonth,'hasGps':day.isGps}">
                                                    {{day.date.getDate()}}
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Row>
                </div>
            </div>
            <div style="display:inline-block;width:calc(100% - 260px);height: 100%;overflow: hidden;padding-left: 12px">
                <div class="trackReviewMap" id="mapDiv" style="height: 60%">
                    <loading-spining v-model="spinShow" style="background: rgba(255,255,255,0.3)"></loading-spining>

                    <div id="map" style="height: 100%;" @click="clickMap"></div>

                    <div class="pa bg fs12 br mapToolList" style="top: 12px;left: 12px;">
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
                    
                    <div class="legend pa bg br p8" style="right: 8px;bottom: 8px;">
                        <div><img :src="routeImg" class="pr mr4" style="width: 20px;top: -2px;" />规划路线</div>
                        <div><img :src="trackImg" class="pr mr4" style="width: 20px;top: -2px;" />轨迹路线</div>
                        <div><img :src="makeUpImg" class="pr mr4" style="width: 20px;top: -2px;" />补传点</div>
                    </div>
                    <div id="alarmDetail"  v-show="showAlarmDetial">
                        <i-button @click="showAlarmDetial=!showAlarmDetial" type="text" style="padding: 0;position: absolute;right: 7px;top: 5px;z-index: 1"><i data-v-394040b0="" class="ivu-icon ivu-icon-ios-close" style="font-size: 18px;"></i></i-button>

                        <Row style="line-height: 25px;font-weight: bold;color:#F13232">
                            {{alarmDetail.alarmTypeText}}
                        </Row>
                        <Row><div class="fl name">车牌号：</div><div class="fl">{{alarmDetail.carLicense}} {{alarmDetail.color}}</div></Row>
                        <Row><div class="fl name">预警时间：</div><div class="fl">{{new Date(alarmDetail.alarmTime).Format('yyyy-MM-dd hh:mm:ss')}}</div></Row>
                        <Row><div class="fl name">处理状态：</div><div class="fl" :style="{'color': alarmDetail.handleStatus? 'green':'red'}">{{alarmDetail.handleStatus?"已处理":"未处理"}}</div></Row>
                        <Row><div class="fl name">处理人：</div><div class="fl">{{alarmDetail.handleOperator||"--"}}</div></Row>
                        <Row><div class="fl name">处理时间：</div><div class="fl">{{handleTime?new Date(alarmDetail.handleTime).Format('yyyy-MM-dd hh:mm:ss'):"--"}}</div></Row>
                        <Row><div class="fl name">速度（km/h）：</div><div class="fl">{{alarmDetail.speed}}</div></Row>
                        <Row><div class="fl name">报警地点：</div><div class="fl analysisAddressmodel">{{alarmDetail.address}}</div></Row>
                        <Row v-if="alarmDetail.fileId">
                            <div class="fl name" >附件：</div>
                            <div class="fl"><div class="imgShowBig">
                            <img :src="alarmDetail.fileId" style="width: auto;height: 100%">
                                <div class="fixedBlack" @click="openPic([alarmDetail.fileId])">点击查看大图</div>
                            </div></div></Row>
                    </div>
                </div>
                <div class="panel trackReviewTable" id="divTable">
                    <div id="layila"><i class="iconfont icon_stretch"></i></div>
                    <Row style="width: calc(100% - 24px);margin-left: 12px;">
                        <Row>
                            <Slider @on-input="sliderInput" :step="0.01"  v-model="playPercent" @click="console.log(playCurrGpsI)"
                                    id="track-slider" status="active" hide-info></Slider>
                        </Row>
                        <Row class="tac" style="height:30px;line-height: 25px; overflow: hidden">
                            <div class="fl" style="display: inline-block;text-align: left">
                                <span style="margin-right: 16px;">  <span style="color: #0F55CF">{{ playCurrMileage }}KM</span> / {{mileageTotal}}KM</span>
                                <span style="color: #0F55CF"> {{ playCurrTime==0?'':playCurrTime.replace(/-/g, '/')}}</span>
                            </div>
                            <Tooltip placement="bottom" content="上一个卫星定位点">
                                <img @click="playPrev" :src="trackPrevImg" width="18">
                            </Tooltip>
                            <Tooltip placement="bottom" :content="playflag ? '暂停' : '播放'">
                                <img class="mr20 ml20"  @click="playflag ? pause() : play()" :src="playflag? trackPauseImg : trackPlayImg"  width="30">
                            </Tooltip>
                            <Tooltip placement="bottom" content="下一个卫星定位点">
                                <img  @click="playNext" :src="trackNextImg"  width="18">
                            </Tooltip>
                            <div class="fr" style="display: block">
                                <radio-group v-model="playSpeed" type="button" size="small">
                                    <radio label="1">正常</radio>
                                    <radio label="4">快速</radio>
                                    <radio label="10">极快</radio>
                                </radio-group>
                            </div>
                        </Row>
                    </Row>

                    <tabs v-model="tabName" class="leftAside">
                        <i-button class="fl" @click="exportTable" size="small" slot="extra" style="margin-top: 5px;margin-right: 15px">导出</i-button>
                        <tab-pane :label="'轨迹点 ( '+gpsAllData.length+'   )'" name="tabName2">
                            <div class="clearfix asideBottom stop mapTable tracingPoint simpleTable">
                                <vehicleGpsData v-model="searchClick" :vehicleId="vehicleId" :total="gpsAllData.length" :startTime="searchTableStartTime" :endTime="searchTableEndTime" :querySupply="retransmittedFlag" :height="tableHeight"></vehicleGpsData>
                            </div>
                        </tab-pane>
                        <tab-pane :label="'预警点 ( '+allAlarmData.length+' )'" name="tabName3">
                            <div class="clearfix asideBottom stop mapTable eventPoints simpleTable">
                                <alarmTable v-model="alarmClick" :vehicleId="vehicleId" :total="allAlarmData.length" :startTime="searchTableStartTime" :endTime="searchTableEndTime" :height="tableHeight" @fileClick="openPic"></alarmTable>
                            </div>
                        </tab-pane>
                        <tab-pane :label="'传感器异常点 ( '+num40001+' )'" name="tabName4">
                            <div class="clearfix asideBottom stop mapTable eventPoints simpleTable">
                                <alarmTable v-model="alarm2Click" :alarmTypes="'40001'" :vehicleId="vehicleId" :total="num40001" :startTime="searchTableStartTime" :endTime="searchTableEndTime" :height="tableHeight" @fileClick="openPic"></alarmTable>
                            </div>
                        </tab-pane>
                    </tabs>
                </div>
            </div>

        </Row>
        <picGroupFixPlayer v-model="picShow" :data="picData" :progressShow="false" ></picGroupFixPlayer>
    </div>
</div>
</template>

<script src="./trackReView.js"></script>