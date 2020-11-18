<template>
<div class="contents grey_b">
    <div class="content" v-cloak>
        <div class="searchBar clearfix">
            <div class="fl mr16 mb8">
                <label class="caption">车牌号</label>
                <carlincense-auto-complete @on-change="changecarLicense" :type="1"></carlincense-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">单证号</label>
                <waybill-auto-complete v-model="waybillNo"></waybill-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">企业名称</label>
                <enterprise-auto-complete v-model="enterpriseName" @on-change="changeEnterprise"></enterprise-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">预警类型</label>
                <i-select class="fl" v-model="alarmType" style="width: 150px;">
                    <i-option v-for="item in alarmTypeList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">预警起止时间</label>
                <datePicker class="fl" v-model="date" type="datetimerange" placeholder="请选择预警起止时间" :clearable="false" :editable="false" @on-change="changeDate" style="width: 340px"></datePicker>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">处理状态</label>
                <i-select class="fl" v-model="status" style="width: 80px;">
                    <i-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mb8">
                <i-button class="fl mr8" type="primary" @click="search">查询</i-button>
                <i-button class="fl" v-if="isAdmin" @click="exportTable">导出</i-button>
            </div>
        </div>
        <div class="tableWap mt4">
            <i-table border :columns="columns" :height="tableHeight" :max-height="tableMaxHeight" :data="tableData" stripe></i-table>
            <div class="pageWap mt12 tar clearfix">
                <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
            </div>
        </div>

        <loading-spining v-model="spinShow"></loading-spining>

        <picGroupFixPlayer v-model="viewFlag" :data="picData" :progressShow="false" ></picGroupFixPlayer>
    </div>
</div>
</template>

<script src="./queryAlarm.js"></script>