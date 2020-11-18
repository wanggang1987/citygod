<template>
    <div class="bigScreen" style="position: relative">
        <Row style="height: 100%;">
            <Row class="bigScreenTitle">
                <div class="titleimg" @click="titlelistShow =! titlelistShow" :class="titleindex">
                    <div class="tac fwb fs32" :class="title.length < 25 ? 'letterSpace' : ''" style="color: #fff;line-height: 76px;">{{ title }}</div>
                    <ul v-show="titlelistShow" class="imglist">
                        <li v-for="(item, index) in list" :key="index" @click="title = item">{{ item }}</li>
                    </ul>
                </div>
                <div class="day pa fs18 ml24"><span class="mr24">{{ day }}</span>星期{{ queryWeek(week) }}</div>
                <Weather class="fs18 pa" :token="token"></Weather>
            </Row>
            <Row style="padding: 11px;height: calc(100% - 80px)">
                <i-col span="18" style="padding: 11px;height: 100%">
                    <Map :token="token" ref="map" height="calc(69% - 20px)" @open-modal="openModal" :alarmpoint="alarmpoint" :showline="vehicleLine"></Map>
                    <RealTimeMonitor :token="token" style="height: 31%"></RealTimeMonitor>
                </i-col>
                <i-col span="6" style="padding: 11px;height: 100%">
                    <pie3D  :token="token" height="calc(37% - 20px)" ref="pie"></pie3D>
                    <RankInAndOut class="mb20" :token="token" style="height: calc(32% - 20px)" ref="RankInAndOut"></RankInAndOut>
                    <AbnormalPush :token="token" style="height: 31%"></AbnormalPush>
                </i-col>
            </Row>
        </Row>
        <vehicleDetailModal v-model="vehicleModal" :vehicleData="vehicleData" :token="token" @add-alarm="alarmPoint" @add-line="addLine"></vehicleDetailModal>
    </div>
</template>

<script src="./bigScreen.js"></script>
