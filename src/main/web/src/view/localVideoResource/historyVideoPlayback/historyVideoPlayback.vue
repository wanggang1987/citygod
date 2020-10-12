<template>
<div class="contents grey_b historyVideoPlayback">
    <div class="content" v-cloak>
        <div class="searchBar clearfix">
            <div class="fl mr16 mb8">
                <label class="caption">车牌号</label>
                <carlincense-auto-complete @on-change="changecarLicense" :type="1"></carlincense-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">企业名称</label>
                <enterprise-auto-complete v-model="enterpriseName" @on-change="changeEnterprise"></enterprise-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">单证号</label>
                <input class="ivu-input fl" v-model="docNum" type="text" style="width: 200px;" placeholder="请输入单证号">
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">完成上传任务</label>
                <i-select class="fl" v-model="uploadTask" style="width: 80px;">
                    <i-option v-for="item in finishUploadTask" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">当前车辆状态</label>
                <i-select class="fl" v-model="carState" style="width: 80px;">
                    <i-option v-for="item in nowCarState" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">单证类型</label>
                <i-select class="fl" v-model="doctype" style="width: 120px;">
                    <i-option v-for="item in documentType" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">在途开始时间</label>
                <date-picker class="fl" style="width: 350px;" @on-change="startTimeChange" v-model="startTime" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" placeholder="选择开始时间" :options="options" transfer></date-picker>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">在途结束时间</label>
                <date-picker class="fl" style="width: 350px;" @on-change="endTimeChange" v-model="endTime" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" placeholder="选择结束时间" :options="options" transfer></date-picker>
            </div>
            <div class="fl mb8">
                <i-button class="fl mr8" type="primary" @click="search">查询</i-button>
            </div>
        </div>
        <div class="tableWap mt4">
            <i-table border :columns="columns" :height="tableHeight" :max-height="tableMaxHeight" :data="tableData" stripe></i-table>
            <div class="pageWap mt12 tar clearfix">
                <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
            </div>
        </div>

        <loading-spining v-model="spinShow"></loading-spining>

        <!-- 查看视频 -->
        <play-video-modal v-model="showModal" :data="videoData"></play-video-modal>

    </div>
</div>
</template>

<script src="./historyVideoPlayback.js"></script>