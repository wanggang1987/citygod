import { isVehicleNumber } from "@/libs/verify";

export default {
    "carLicense": [
        {
            "required": true, 
            "trigger": "blur",
            validator (rule, value, callback) {
                if (!value) {
                    return callback(new Error("车牌号不能为空"));
                } else if (!isVehicleNumber(value)) {
                    return callback(new Error("车牌号格式不正确"));
                } else {
                    return callback();
                }
            }
        }
    ],
    "plateColor": [
        {
            "required": true, 
            "trigger": "change",
            validator (rule, value, callback) {
                if (!value) {
                    return callback(new Error("车牌颜色不能为空"));
                } else {
                    return callback();
                }
            }
        }
    ],
    "simCardNo": [
        {
            "required": true, 
            "trigger": "blur",
            "message": "SIM卡号不能为空"
        }
    ],
    "channel": [
        {
            "required": true,
            "trigger": "change",
            validator (rule, value, callback) {
                if (!value.length) {
                    return callback(new Error("通道号不能为空"));
                } else {
                    return callback();
                }
            }
        }
    ]
};