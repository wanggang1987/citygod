import * as yd from "@/libs/yd";
import loadingSpin from "_c/loading-spin";
import tableBase from "_m/tableBase";

export default {
    "name": "downExport",
    "mixins": [tableBase],
    "components": {
        "loading-spining": loadingSpin
    },
    data () {
        const self = this;
        return {
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "操作",
                    "type": "action",
                    "minWidth": 122,
                    "render": (h, params) => {
                        const handleStatus = params.row.handleStatus;
                        let child = [];

                        const down = h("a", {
                            "class": "mr10",
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    window.open(params.row.filePath);
                                }
                            }
                        }, "下载");
                        const del = h("a", {
                            "style": {
                                "color": "#2059EF"
                            },
                            "on": {
                                "click": () => {
                                    self.del(params.row.id);
                                }
                            }
                        }, "删除");
                        const downDisabled = h("a", {
                            "class": "mr10",
                            "style": {
                                "color": "#ccd0d3"
                            }
                        }, "无法下载");

                        const delDisabled = h("a", {
                            "style": {
                                "color": "#ccd0d3"
                            }
                        }, "无法删除");
                        if (handleStatus === "SUCCESS" || handleStatus === "FAIL") {
                            child = handleStatus === "SUCCESS" ? [down, del] : [downDisabled, del];
                        } else {
                            child = [downDisabled, delDisabled];
                        }
                        return h("div", child);
                    }
                },{
                    "title": "任务名称",
                    "minWidth": 300,
                    "key": "taskName"
                },{
                    "title": "任务状态",
                    "minWidth": 150,
                    "render": (h, params) => {
                        const map = {
                            "SUCCESS": {
                                "color": "#3B9044",
                                "status": "下载完成"
                            },
                            "FAIL": {
                                "color": "#E50011",
                                "status": "下载失败"
                            },
                            "INIT": {
                                "color": "#FA6400",
                                "status": "下载中"
                            },
                            "PROCESS": {
                                "color": "#7E7E7E",
                                "status": "下载未开始"
                            }
                        };
                        let handleStatus = params.row.handleStatus;
                        handleStatus = handleStatus === "INIT" && params.row.progressRate === 0 ? "PROCESS" : handleStatus;
                        const style = map[handleStatus];
                        return h("span", {
                            "style": {
                                "color": style.color
                            }
                        }, style.status);
                    }
                },{
                    "title": "创建时间",
                    "minWidth": 200,
                    "key": "createTime",
                    "render": (h, params) => {
                        const createTime = params.row.createTime ? new Date((params.row.createTime)).Format("yyyy/MM/dd hh:mm:ss") : "--";
                        return self.tooltipRender(h, createTime);
                    }
                },{
                    "title": "文件大小",
                    "align": "right",
                    "minWidth": 120,
                    "key": "fileSize",
                    "render": (h, params) => {
                        if (!params.row.fileSize) return "--";
                        let content = "--";
                        if (params.row.handleStatus === "SUCCESS") {
                            let fileSize = parseInt(params.row.fileSize) / 1048576;
                            if (fileSize >= 1) {
                                content = fileSize.toFixed(2) + "Mb";
                            } else {
                                content = (fileSize * 1024).toFixed(2) + "Kb";
                            }
                        }
                        return content;
                    }
                }
            ],
            "timer": ""
        };
    },
    "methods": {
        //查询下载列表
        loadTable () {
            const self = this;
            self.spinShow = true;
            clearTimeout(self.timer);
            yd.ajax({
                "url": "/apiprovince/downloadCenter/queryDownloadCenterTaskList",
                "type": "POST",
                "data": {
                    "pageSize": self.pageSize,
                    "pageNo": self.pageNo
                },
                success (json) {
                    self.total = json.totalCount || 0;
                    self.tableData = json.downloadCenterTaskInfoList || [];
                },
                complete () {
                    self.spinShow = false;
                    self.timer = setTimeout(() => {
                        self.loadTable();
                    }, 30000);
                }
            });
        },
        //删除
        del (id) {
            const self = this;
            self.$Modal.confirm({
                "okText": "确定",
                "cancelText": "取消",
                "content": "<p>删除将无法恢复，是否确认删除</p>",
                "onOk": () => {
                    yd.ajax({
                        "url": "../apiprovince/downloadCenter/deleteDownloadCenterTask",
                        "data": {
                            "id": id
                        },
                        success (json) {
                            self.$Message.success("删除成功");
                            self.loadTable();
                        }
                    });
                }
            });
        }
    },
    "beforeRouteEnter": (to, from, next) => {
        next(self => {
            self.loadTable();
        });
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        clearTimeout(this.timer);
        next();
    }
};