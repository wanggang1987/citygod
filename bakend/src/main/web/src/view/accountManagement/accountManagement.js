import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import tableBase from "_m/tableBase";
import loadingSpin from "_c/loading-spin";
import accountDetail from "./components/details.vue";
import editModal from "./components/editModal";

export default {
    "name": "accountManagement",
    "mixins": [tableBase],
    "components": {
        "loading-spining": loadingSpin,
        "accountDetail": accountDetail,
        "editModal": editModal
    },
    data () {
        const self = this;
        return {
            "account": "",
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "操作",
                    "minWidth": 120,
                    "render": (h, params) => {
                        let child = [
                            h("a", {
                                "class": "mr10",
                                "style": {
                                    "color": "#2059EF"
                                },
                                "on": {
                                    "click": () => {
                                        self.edit(params.row);
                                    }
                                }
                            }, "编辑"),
                            h("a", {
                                "class": "mr10",
                                "style": {
                                    "color": "#2059EF"
                                },
                                "on": {
                                    "click": () => {
                                        self.view(params.row);
                                    }
                                }
                            }, "查看"),
                            h("a", {
                                "style": {
                                    "color": "#2059EF"
                                },
                                "on": {
                                    "click": () => {
                                        self.del(params.row);

                                    }
                                }
                            }, "删除")
                        ];

                        if (params.row.roleName == "省平台") child = child.splice(1, 1);


                        return h("div", child);
                    }
                },{
                    "title": "账号",
                    "key": "name",
                    "tooltip": true,
                    "minWidth": 160
                },{
                    "title": "菜单权限",
                    "key": "menuCount",
                    "tooltip": true,
                    "minWidth": 80
                },{
                    "title": "创建时间",
                    "key": "createTime",
                    "minWidth": 180,
                    "render": (h, params) => {
                        return params.row.createTime ? new Date(params.row.createTime).Format("yyyy-MM-dd hh:mm:ss") : "--";
                    }
                }
            ],
            "showFlag": false,
            "editFlag": false,
            "id": 0
        };
    },
    mounted () {
        const self = this;
        self.search();
    },
    "methods": {
        search () {
            const self = this;
            self.pageNo = 1;
            self.params = {
                "account": self.account || null
            };
            self.loadTable();
        },
        loadTable () {
            const self = this;
            self.spinShow = true;
            let params = {
                ...self.params,
                "pageNo": self.pageNo,
                "pageSize": self.pageSize
            };
            yd.ajax({
                "url": "../apiprovince/account/queryUserPageList",
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.list || [];
                    self.total= json.count || 0;
                },
                error () {
                    self.total = 0;
                    self.tableData = [];
                },
                complete () {
                    self.spinShow = false;
                }
            });
        },
        add () {
            const self = this;
            self.editFlag = true;
            self.id = 0;
        },
        view (json) {
            const self = this;
            self.showFlag = true;
            self.id = json.id;
        },
        edit (json) {
            const self = this;
            self.editFlag = true;
            self.id = json.id;
        },
        del (json) {
            const self = this;
            self.$Modal.confirm({
                "title": "确认删除该账号吗？",
                "onOk": () => {
                    yd.ajax({
                        "url": "../apiprovince/account/deleteAccount",
                        "data": { 
                            "id": json.id
                        },
                        success (json) {
                            if (json){
                                self.$Message.success("账号删除成功");
                            } else {
                                self.$Message.error("账号删除失败");
                            }
                            self.loadTable();
                        }
                    });
                }
            });
        }
    }
};