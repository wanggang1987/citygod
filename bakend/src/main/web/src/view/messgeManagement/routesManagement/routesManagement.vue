<template>
    <div class="contents grey_b">
        <div class="content clearfix routePage">
            <div class="searchBar clearfix">
                <div class="fl mr16 mb8">
                    <label class="caption">行驶路线名称</label>
                    <Input v-model="zoneName" placeholder="请输入行驶路线名称"  style="width: 200px"/>
                </div>
                <div class="fl mr16 mb8">
                    <label class="caption">单证类型</label>
                    <documentTypeTreeSelect v-model="documentType" style="width: 200px"></documentTypeTreeSelect>
                </div>
                <div class="fl mr16 mb8">
                    <label class="caption">状态</label>
                    <Select v-model="status" style="width:80px">
                        <Option value="-1" >全部</Option>
                        <Option value="1" >是</Option>
                        <Option value="0" >否</Option>
                    </Select>
                </div>
                <div class="fl mb8">
                    <i-button class="fl mr8" @click="search" type="primary">查询</i-button>
                    <i-button class="fl mr8" v-if="isAdmin" @click="addRoute" type="primary">新增</i-button>
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
<script src="./routesMangement.js"></script>
