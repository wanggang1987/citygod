<template>
<div class="contents grey_b">
    <div class="content clearfix">
        <div class="searchBar clearfix">
            <div class="fl mr16 mb8">
                <label class="caption">围栏名称</label>
                <i-input class="fl" v-model="fencesName" placeholder="请输入围栏名称" style="width: 200px"></i-input>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">单证类型</label>
                <i-select class="fl" v-model="type" style="width: 105px;">
                    <i-option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">状态</label>
                <i-select class="fl" v-model="status" style="width: 80px;">
                    <i-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="fl mb8">
                <i-button class="fl mr8" @click="search" type="primary">查询</i-button>
                <i-button class="fl" v-if="isAdmin" @click="add">新增</i-button>
            </div>
        </div>
        <div class="tableWap mt4">
            <i-table border :columns="columns" :height="tableHeight" :max-height="tableMaxHeight" :data="tableData" stripe></i-table>
            <div class="pageWap mt12 tar clearfix">
                <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
            </div>
        </div>

        <loading-spining v-model="spinShow"></loading-spining>
    </div>
</div>
</template>

<script src="./manageFence.js"></script>