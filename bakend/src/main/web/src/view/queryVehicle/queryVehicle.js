import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import loadingSpin from "_c/loading-spin";
import tabletip from "_c/table-tip";
import enterpriseAutoComplete from "_c/autoComplete/enterprise";
import carLicenseAutoComplete from "_c/autoComplete/carLicense";
import tableBase from "_m/tableBase";
import vehicleDetail from "./components/details";
import editModal from "./components/editModal";
import importModal from "_c/importModal";

export default {
    "name": "queryVehicle",
    "mixins": [tableBase],
    "components": {
        "enterprise-auto-complete": enterpriseAutoComplete,
        "carlincense-auto-complete": carLicenseAutoComplete,
        "editModal": editModal,
        "vehicleDetail": vehicleDetail,
        "importModal": importModal,
        "loading-spining": loadingSpin,
        "tabletip": tabletip
    },
    data () {
        const self = this;
        return {
            "vehicleId": "",
            "simCard": "",
            "deviceName": "",
            "enterpriseId": "",
            "enterpriseName": "",
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "操作",
                    "minWidth": 130,
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
                        return h("div", child);
                    }
                },{
                    "title": "车牌号",
                    "key": "carLicense",
                    "minWidth": 120,
                    "render": (h, params) => {
                        let carLicense = params.row.carLicense;
                        const plateColor = SubConfig.plateColor[params.row.plateColor];
                        carLicense = plateColor ? `${carLicense} ${plateColor}` : carLicense;
                        return self.tooltipRender(h, carLicense);
                    }
                },{
                    "title": "企业名称",
                    "key": "enterpriseName",
                    "tooltip": true,
                    "minWidth": 200
                },{
                    "title": "SIM卡号",
                    "key": "simCardNo",
                    "minWidth": 140,
                    "render": (h, params) => {
                        return self.tooltipRender(h, params.row.simCardNo);
                    }
                },{
                    "title": "通道号",
                    "key": "channel",
                    "minWidth": 350,
                    "render": (h, params) => {
                        const channels = params.row.channel.split(",");
                        const channel = channels.map((item) => {
                            return SubConfig.videoChannel[item];
                        });
                        return self.tooltipRender(h, channel.toString());
                    }
                }
            ],
            "viewFlag": false,
            "editFlag": false,
            "editData": {},
            "showImportModal": false,
            "action": "apiprovince/province/vehicle/import",
            "templateUrl": "/template/%e8%bd%a6%e8%be%86%e5%af%bc%e5%85%a5%e6%a8%a1%e6%9d%bf.xls"
        };
    },
    "computed": {
        isAdmin () {
            return this.$store.state.user.userName === "admin";
        }
    },
    created () {
        const self = this;
        if (!self.isAdmin) self.columns.splice(1, 1);
    },
    mounted() {
        this.search();
    },
    "methods": {
        search () {
            const self = this;
            self.pageNo = 1;
            self.params = {
                "vehicleId": self.vehicleId || null,
                "enterpriseId": self.enterpriseId || null, //所属企业
                "simCardNo": self.simCard || null //sim 卡号
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
                "url": "../apiprovince/province/queryProvinceVehicleInfo",
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.tag || [];
                    self.total = json.result || 0;
                },
                error () {
                    self.tableData = [];
                    self.total = 0;
                },
                complete () {
                    self.spinShow = false;
                }
            });
        },
        add () {
            const self = this;
            self.editFlag = true;
            self.editData = {};
        },
        edit (json) {
            const self = this;
            self.editFlag = true;
            self.editData = json;
        },
        view (json) {
            const self = this;
            self.viewFlag = true;
            self.editData = json;
        },
        enterPort () {
            const self = this;
            self.showImportModal = true;
        },
        enterPortError () {
            const self = this;
            self.showImportModal = false;
            self.loadTable();
        },
        del (json) {
            const self = this;
            self.$Modal.confirm({
                "title": "确认删除该车辆信息吗？",
                "onOk": () => {
                    yd.ajax({
                        "url": "../apiprovince/province/vehicle/deleteVehicle",
                        "type": "POST",
                        "data": { 
                            "vehicleId": json.vehicleId
                        },
                        success (json) {
                            if (json){
                                self.$Message.success("车辆删除成功");
                            } else {
                                self.$Message.error("车辆删除失败");
                            }
                            self.loadTable();
                        }
                    });
                }
            });
        },
        //企业输入联想
        changeEnterprise (id) {
            this.enterpriseId = id;
        },
        changecarLicense (id) {
            this.vehicleId = id;
        }
    }
};