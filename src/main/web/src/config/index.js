let moduleName = "webprovince";
let baseUrl = "http://119.3.109.192:81";
let title = "南京海关“慧眼通”智慧物流监管平台•车辆监管模块";
const host = location.host;

switch (host) {
    case "119.3.109.192:8008": // QA环境
        break;
    case "58.215.217.234:8086": // Prod
        baseUrl = "http://58.215.217.234:8090";
        break;
    case "192.1.22.205:8086": // Prod
        baseUrl = "http://192.1.22.205:8090";
        break;
    default:
} 



export default {
    "moduleName": moduleName,
    "baseUrl": baseUrl,
    "title": title,
    /**
       * @description 默认打开的首页的路由name值，默认为home
       */
    "homeName": "home",
    /**
       * @description token在Cookie中存储的天数，默认1天
       */
    "cookieExpires": 1,
    "ak": "P9urhjaTGlFXaYZrYen1jHcQv2rIizFG",//百度地图ak
    "isAccess": [] //额外页面权限
};