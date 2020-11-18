import tabsMixins from "_m/tabs";
import VueRouter from "vue-router";

let router = new VueRouter({
    "linkActiveClass": "active",
    "routes": [
        {
            "path": "*",
            "redirect": "/vehicle"
        }, {
            "path": "/vehicle",
            "name": "vehicle",
            "component": () => import("./vehicle")
        }, {
            "path": "/details",
            "name": "details",
            "component": () => import("./details")
        }
    ]
});

export default {
    "name": "doorMagnetic",
    "mixins": [tabsMixins],
    "router": router,
    data () {
        return {
            "tabs": [
                {
                    "title": "车辆",
                    "name": "vehicle",
                    "url": "/vehicle"
                }, {
                    "title": "明细",
                    "name": "details",
                    "url": "/details"
                }
            ]
        };
    }
};