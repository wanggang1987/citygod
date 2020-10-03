<template>
<div class="contents grey_b">
    <div class="content clearfix">
        <div class="searchBar clearfix">
            <div class="fl mr16 mb8">
                <label class="caption">账号</label>
                <i-input v-model="account" style="width:200px;" placeholder="请输入账号"></i-input>
            </div>
            <div class="fl mb8">
                <i-button class="fl mr8" type="primary" @click="search">查询</i-button>
                <i-button class="fl" @click="add">新增</i-button>
            </div>
        </div>
        <div class="tableWap mt4">
            <i-table border :columns="columns" :height="tableHeight" :max-height="tableMaxHeight" :data="tableData" stripe></i-table>
            <div class="pageWap mt12 tar clearfix">
                <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
            </div>
        </div>

        <loading-spining v-model="spinShow"></loading-spining>

        <!-- 查看 start -->
        <accountDetail v-model="showFlag" :id="id"></accountDetail>
        <!-- 查看 end -->

        <!-- 编辑 start -->
        <editModal v-model="editFlag" :id="id" @on-success="loadTable"></editModal>
        <!-- 编辑 end -->

    </div>
</div>
</template>

<script src="./accountManagement.js"></script>