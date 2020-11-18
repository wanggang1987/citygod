<template>
    <div>
        <i-table border @on-sort-change="sortIncident"  size="small" :columns="columnsIncident" :data="tableData" :height="height"></i-table>
        <div class="pageWap mt4 tar clearfix">
            <Page size="small" :total="total" :current="pageNo" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer :page-size-opts="pageSizeOpts" show-total show-elevator></Page>
        </div>
    </div>
</template>

<script src="./alarmTable.js"></script>
<style scoped>

</style>