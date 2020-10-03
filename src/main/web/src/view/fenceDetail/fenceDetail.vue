<template>
<div class="contents grey_b">
    <div class="content clearfix fenceDetail">
        <Row class="basicInfo pb8">
            <i-col v-if="zoneType==0" span="24">
                <label>行驶路线：</label>{{ fromName }}——{{toName}}
            </i-col>
            <i-col span="12">
               <label>{{ zoneType ? "围栏" : "路线" }}名称：</label>{{ zoneName }}
            </i-col>
            <i-col span="12">
               <label>单证类型：</label>{{ documentType }}
            </i-col>
            <i-col span="12">
               <label>{{ zoneType ? "围栏" : "路线" }}状态：</label>{{ zoneStatus }}
            </i-col>
        </Row>
        <div class="pr">
            <div id="railMap" @click="enableScrollWheelZoom" :style="{'height' : mapHeight + 'px'}"></div>
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
        </div>
    </div>
</div>
</template>

<script src="./fenceDetail.js"></script>