import mixins from "../mixins";

//企业名称

export default {
    "name": "enterpriseAutoComplete",
    "mixins": [mixins],
    "props": {
        "placeholder": {
            "type": String,
            "default": "请输入企业名称"
        }
    },
    data () {
        return {
            "options": {
                "url": "../apiprovince/province/home/queryCompanyByName",
                "type": "GET"
            }
        };
    },
    "methods": {
        format (data) {
            return data.tag;
        },
        queryParams (name) {
            return {
                "companyName": name
            };
        }
    }
};