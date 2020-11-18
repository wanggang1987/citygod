<template>
<div class="pr12 pl12 pt12">
    <div class="searchBar clearfix">
        <div class="fl mr16 mb8">
            <label class="caption">车牌号</label>
            <carlincense-auto-complete class="fl" v-model="carLicense" @on-change="changecarLicense"></carlincense-auto-complete>
        </div>
        <div class="fl mr16 mb8">
            <label class="caption">企业名称</label>
            <enterprise-auto-complete class="fl" v-model="enterpriseName" @on-change="changeEnterprise"></enterprise-auto-complete>
        </div>
        <div class="fl mr16 mb8">
            <label class="caption">传感器状态</label>
            <i-select class="fl" v-model="status" style="width: 80px;">
                <i-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
            </i-select>
        </div>
        <div class="fl mr16 mb8">
            <label class="caption">查询日期</label>
            <datePicker class="fl" v-model="date" type="daterange" placeholder="请选择查询日期" :clearable="false" :editable="false" style="width: 216px"></datePicker>
        </div>
        <div class="fl mb8">
            <i-button class="fl mr8" type="primary" @click="search">查询</i-button>
            <i-button class="fl" v-if="isAdmin" @click="exportTable">导出</i-button>
        </div>
    </div>
    <div class="tableWap mt4">
        <i-table border :columns="columns" :height="tableHeight" :max-height="tableMaxHeight" :data="tableData" stripe @on-sort-change="sortTable"></i-table>
        <div class="pageWap mt12 tar clearfix">
            <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
        </div>
    </div>

    <loading-spining v-model="spinShow"></loading-spining>
</div>
</template>

<script src="./doorMagnetic.js"></script>