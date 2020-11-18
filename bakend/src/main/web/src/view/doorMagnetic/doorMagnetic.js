import * as yd from "@/libs/yd";
import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import { generateList } from "@/libs/tools";
import loadingSpin from "_c/loading-spin";
import tabletip from "_c/table-tip";
import enterpriseAutoComplete from "_c/autoComplete/enterprise";
import carLicenseAutoComplete from "_c/autoComplete/carLicense";
import tableBase from "_m/tableBase";

export default {
    "name": "doorMagnetic",
    "mixins": [tableBase],
    "components": {
        "enterprise-auto-complete": enterpriseAutoComplete,
        "carlincense-auto-complete": carLicenseAutoComplete,
        "loading-spining": loadingSpin,
        "tabletip": tabletip
    },
    data () {
        const self = this;
        return {
            "vehicleId": "",
            "carLicense": "",
            "companyId": "",
            "enterpriseName": "",
            "date": [new Date(), new Date()],
            "status": "-1", 
            "statusList": generateList(SubConfig.magnetismStatus),
            "sortColumn": "",
            "sortType": "normal"
        };
    },
    "computed": {
        isAdmin () {
            return this.$store.state.user.userName === "admin";
        }
    },
    mounted () {
        this.search();
        window.vm=this;
    },
    "methods": {
        loadTable () {
            const self = this;
            self.spinShow = true;
            let params = {
                ...self.params,
                "sortColumn": self.sortColumn || null,
                "sortType": self.sortType != "normal" ? self.sortType.toLocaleUpperCase() : null,
                "pageNo": self.pageNo,
                "pageSize": self.pageSize
            };
            yd.ajax({
                "url": self.queryUrl,
                "type": "POST",
                "data": params,
                success (json) {
                    self.tableData = json.list || [];
                    self.total = json.count || 0;
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
        exportTable () {
            const self = this;
            let params = {
                ...self.params,
                "sortColumn": self.sortColumn || null,
                "sortType": self.sortType != "normal" ? self.sortType.toLocaleUpperCase() : null
            };
            yd.exportFile(self.exportUrl, params, "POST");
        },
        //企业输入联想
        changeEnterprise (id) {
            this.companyId = id;
        },
        changecarLicense (id) {
            this.vehicleId = id;
        },
        sortTable ({key, order}) {
            this.sortColumn = key;
            this.sortType = order;
            this.loadTable();
        }
    }

};