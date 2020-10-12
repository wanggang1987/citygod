<template>
<div class="contents grey_b">
    <div class="content clearfix">
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

<script src="./downExport.js"></script>