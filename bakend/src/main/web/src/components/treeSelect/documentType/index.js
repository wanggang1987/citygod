import mixins from "../mixins";
import * as SubConfig from "@/libs/SubConfig";

// 单证类型

export default {
    "name": "documentTypeTreeSelect",
    "mixins": [mixins],
    "props": {
        // 初始选中值
        "value": {
            "type": Array,
            default () {
                return [];
            }
        },
        // 选项（注：选项必须包含初始选中值）
        "data": {
            "type": Object,
            default () {
                return {
                    ...SubConfig.documentType
                };
            }
        },
        "placeholder": {
            "type": String,
            "default": "单证类型"
        }
    },
    "methods": {
        init () {
            const self = this;
            let arr = [];
            Object.keys(self.data).forEach((item, i) => {
                let obj = {
                    "title": SubConfig.documentType[item],
                    "id": item
                };
                arr.push(obj);
            });
            self.originData = arr;
            self.render();
            self.$emit("ready");
        }
    }
};