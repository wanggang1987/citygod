<template>
<div class="contents grey_b">
    <div class="content" v-cloak>
        <div class="searchBar clearfix">
            <div class="fl mr16 mb8">
                <label class="caption">车牌号</label>
                <carlincense-auto-complete @on-change="changecarLicense" :type="1"></carlincense-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">所属企业</label>
                <enterprise-auto-complete v-model="enterpriseName" @on-change="changeEnterprise"></enterprise-auto-complete>
            </div>
            <div class="fl mr16 mb8">
                <label class="caption">SIM卡号</label>
                <i-input type="text" v-model="simCard" placeholder="请输入SIM卡号" style="width:200px;"></i-input>
            </div>
            <div class="fl mb8">
                <i-button class="fl mr8" type="primary" @click="search">查询</i-button>
                <i-button class="fl mr8" v-if="isAdmin" @click="add">新增</i-button>
                <i-button class="fl" v-if="isAdmin" @click="enterPort">导入</i-button>
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
        <vehicleDetail v-model="viewFlag" :data="editData"></vehicleDetail>
        <!-- 查看 end -->

        <!-- 编辑 start -->
        <editModal v-model="editFlag" :data="editData" @on-success="loadTable"></editModal>
        <!-- 编辑 end -->

        <!-- 导入 start -->
        <importModal v-model="showImportModal" :action="action" :template-url="templateUrl" @on-success="loadTable" @on-error="enterPortError"></importModal>
        <!-- 导入 end -->

    </div>
</div>
</template>

<script src="./queryVehicle.js"></script>
