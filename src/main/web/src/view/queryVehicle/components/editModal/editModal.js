import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";
import { generateList } from "@/libs/tools";
import customModalBase from "_m/customModalBase";
import enterpriseAutoComplete from "_c/autoComplete/enterprise";
import rules from "./rules.js";


export default {
    "name": "editModal",
    "mixins": [customModalBase],
    "components": {
        "enterprise-auto-complete": enterpriseAutoComplete
    },
    "props": {
        "data": {
            "type": Object,
            "default": () => {
                return {};
            }
        }
    },
    data () {
        const self = this;
        return {
            "id": 0,
            "carLicense": "", // 车牌号
            "plateColor": 0, // 车牌颜色
            "plateColorList": generateList(SubConfig.plateColor, false, true),
            "companyName": "", // 企业名称
            "companyId": 0,
            "flag": false, // 标记企业名称是否进行过输入
            "simCardNo": "", // SIM卡号
            "channel": [], // 通道号
            "channelList": generateList(SubConfig.videoChannel, false),  
            "rules": rules,
            "companyRule": {
                "required": true,
                "trigger": "change",
                validator (rule, value, callback) {
                    if (!self.flag) return callback(); // 默认值不进行校验
                    if (!value) {
                        return callback(new Error("企业名称不能为空"));
                    } else if (value == -1) {
                        return callback(new Error("请选择有效的企业名称"));
                    } else {
                        return callback();
                    }
                }
            }
        };
    },
    "methods": {
        init () {
            const self = this;
            self.$refs.form.resetFields();
            self.render(self.data); 
        },
        render (json = {}) {
            const self = this;
            self.id = json.vehicleId || 0;
            self.carLicense = json.carLicense || "";
            self.plateColor = json.plateColor || "";
            self.simCardNo = json.simCardNo || "";
            self.channel = json.channel ? json.channel.split(",") : [];
            self.flag = false; // 重置输入状态
            self.companyId = json.enterpriseId || 0;
            self.companyName = json.enterpriseName || ""; // 企业名称
        },
        // 企业输入联想
        changeEnterprise (companyId, companyName) {
            const self = this;
            self.companyId = companyId;
            self.$refs.form.validateField("companyId");
            if (companyName) self.flag = true; // 匹配非空值之后输入状态置为true，开启校验
        },
        ok () {
            const self = this;
            self.flag = true; // 保存之前开启校验
            self.$refs.form.validate((valid) => {
                if (valid) {
                    let params = {
                        "carLicense": self.carLicense,
                        "plateColor": self.plateColor,
                        "simCardNo": self.simCardNo,
                        "companyId": self.companyId,
                        "groupName": self.companyName,
                        "channel": self.channel.sort().toString()
                    };
                    self.submit(params);
                }
            });
        },
        submit (params) {
            const self = this;
            yd.ajax({
                "url": self.id ? "../apiprovince/province/vehicle/updateVehicle" : "../apiprovince/province/vehicle/insertVehicle",
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
        }
        
    }
};