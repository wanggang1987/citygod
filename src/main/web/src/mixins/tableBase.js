import tabletip from "_c/table-tip";
import $ from "jquery";

export default {
    "components": {
        "tabletip": tabletip
    },
    data () {
        return {
            "columns": [],
            "tableData": [],
            "total": 0,
            "pageSize": 15,
            "pageNo": 1,
            "pageSizeOpts": [15, 30, 50, 100],
            "params": {},
            "spinShow": false,
            "tableMaxHeight": 535
        };
    },
    "computed": {
        tableHeight () {
            return !this.tableData.length ? this.tableMaxHeight : 0;
        }
    },
    mounted () {
        this.calcTableHeight();
    },
    "methods": {
        changePage (page) {
            const self = this;
            self.pageNo = page;
            self.loadTable();
        },
        changePageSize (pageSize) {
            const self = this;
            self.pageNo = 1;
            self.pageSize = pageSize;
            self.loadTable();
        },
        tooltipRender (h, content) {
            if (!content && content !==0 ) content = "--";
            return h(tabletip, {
                "props": {
                    "content": content
                }
            }, content);
        },
        calcTableHeight () {
            const searchBar = document.getElementsByClassName("searchBar")[0];
            let height = searchBar ? searchBar.offsetHeight : 0;
            const menuTab = document.getElementsByClassName("menuTab")[0];
            let tabHeight = menuTab ? 51 : 0;
            const pageWap = document.getElementsByClassName("pageWap")[0];
            let pageHeight = pageWap ? 37 : 0;

            // this.tableMaxHeight = this.$store.state.app.contentHeight - 83 - height - (tabHeight ? (tabHeight + 8) : 0);
            this.tableMaxHeight = this.$store.state.app.contentHeight - 51 - height - tabHeight - pageHeight;
        }
    }
};