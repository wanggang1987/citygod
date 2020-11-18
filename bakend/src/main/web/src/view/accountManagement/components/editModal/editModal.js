import * as yd from "@/libs/yd";
import customModalBase from "_m/customModalBase";
import mixins from "../mixins";
import rules from "./rules.js";


export default {
    "name": "editModal",
    "mixins": [customModalBase, mixins],
    "props": {
        "id": {
            "type": Number,
            "default": 0
        }
    },
    data () {
        const self = this;
        return {
            "name": "", // 账号
            "passwd": "", // 密码
            "rules": rules,
            "treeData": []
        };
    },
    "methods": {
        init () {
            const self = this;
            self.$refs.form.resetFields();
            if (self.id) {
                self.query();
            } else {
                self.render();
            } 
        },
        render (json = {}) {
            const self = this;
            self.name = json.name || ""; // 账号
            self.applications = json.applications || ["首页"];
            self.treeData = self.queryTreeData(this.menuList);
        },
        query () {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/account/queryAccountDetail",
                "data": {
                    "id": self.id
                },
                success (json) {
                    self.render(json);
                },
                error () {
                    self.render();
                }
            });
        },
        ok () {
            const self = this;
            self.$refs.form.validate((valid) => {
                if (valid) {
                    let params = {
                        "id": self.id || null,
                        "name": self.name,
                        "passwd": self.id ? null : self.passwd,
                        "applications": self.applications
                    };
                    self.submit(params);
                }
            });
        },
        submit (params) {
            const self = this;
            yd.ajax({
                "url": !self.id ? "../apiprovince/account/addAccount" : "../apiprovince/account/updateAccount",
                "type": "POST",
                "data": params,
                success (json) {
                    if (json.success) {
                        self.$Message.success("操作成功！");
                        self.modal = false;
                        self.$emit("on-success");
                    } else {
                        self.$Message.error(json.msg || "操作失败！");
                        self.$emit("on-error");
                    }
                },
                error () {
                    self.$Message.error("操作失败！");
                    self.$emit("on-error");
                }
            });
        },
        checkChange (json) {
            let arr = [];
            json.forEach((item) => {
                if (!item.children) arr.push(item.title);
            });
            this.applications = arr;
        }
    }
};