import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
import yd from "@/libs/yd";
import config from "@/config";
import "@/index.less";

window.document.title = config.title;

Vue.config.productionTip = false;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

new Vue({
    "el": "#app",
    router,
    store,
    "render": h => h(App)
});
