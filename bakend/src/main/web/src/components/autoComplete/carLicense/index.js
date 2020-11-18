import mixins from "../mixins";
import * as SubConfig from "@/libs/SubConfig";
//车牌号

export default {
    "name": "carLicenseAutoComplete",
    "mixins": [mixins],
    "props": {
        "placeholder": {
            "type": String,
            "default": "请输入车牌号"
        },
        "type": {
            "type": Number,
            "default": 0
        }
    },
    data () {
        const self = this;
        return {
            "options": {
                "url": self.type ? "../apiprovince/province/home/queryAllVehiclesByCarLicense":"../apiprovince/province/home/queryVehiclesByCarLicense",
                "type": "GET"
            }
        };
    },
    "methods": {
        format (data) {
            let json = data.tag || [];
            json.forEach((item, i) => {
                item.id = item.vehicleId;
                item.name = item.carLicense +" "+ SubConfig.plateColor[item.plateColor];
            });
            return json;
        },
        queryParams (name) {
            return {
                "carLicense": name.split(" ")[0]
            };
        }
    }
};