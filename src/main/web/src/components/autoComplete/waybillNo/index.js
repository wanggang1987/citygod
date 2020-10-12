import mixins from "../mixins";
import * as SubConfig from "@/libs/SubConfig";
//单证号

export default {
    "name": "waybillAutoComplete",
    "mixins": [mixins],
    "props": {
        "placeholder": {
            "type": String,
            "default": "请输入单证号"
        }
    },
    data () {
        const self = this;
        return {
            "options": {
                "url": "../apiprovince/waybill/queryWaybillListLikeWaybillNo",
                "type": "POST"
            }
        };
    },
    "methods": {
        format (data) {
            let json = data.tag || [];
            json.forEach((item, i) => {
                item.id = i + 1;
                item.name = item.waybillNo;
            });
            return json;
        },
        queryParams (name) {
            return {
                "waybillNo": name
            };
        }
    }
};