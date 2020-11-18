import Main from "@/components/main";
import config from "@/config";
/**
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 * }
 */
 
export default [
    {
        "path": "/login",
        "name": "login",
        "meta": {
            "title": "登录",
            "hideInMenu": true
        },
        "component": () => import("@/view/login")
    }, {
        "path": "/bigScreen",
        "name": "bigScreen",
        "meta": {
            "title": "大屏",
            "hideInMenu": true,
            "isAccess": true
        },
        "component": () => import("@/view/bigScreen")
    }, {
        "path": "/",
        "name": "_home",
        "redirect": "/home",
        "component": Main,
        "meta": {
            "hideInBread": true,
            "notCache": true
        },
        "children": [
            {
                "path": "/home",
                "name": "home",
                "meta": {
                    "title": "首页",
                    "icon": "icon_menu_home",
                    "notCache": true
                },
                "component": () => import("@/view/home")
            }
        ]
    }, {
        "path": "/dayMonitor",
        "name": "dayMonitor",
        "component": Main,
        "meta": {
            "title": "日常监管",
            "icon": "icon_menu_supervision",
            "showAlways": true
        },
        "children": [
            {
                "path": "realTimeMonitor",
                "name": "realTimeMonitor",
                "meta": {
                    "title": "实时监控"
                },
                "component": () => import("@/view/realTimeMonitor")
            }, {
                "path": "videoPlayBack",
                "name": "videoPlayBack",
                "meta": {
                    "title": "视频回放"
                },
                "component": () => import("@/view/videoPlayBack")
            }, {
                "path": "trackReView",
                "name": "trackReView",
                "meta": {
                    "title": "轨迹回放"
                },
                "component": () => import("@/view/trackReView")
            }, {
                "path": "doorMagnetic",
                "name": "doorMagnetic",
                "meta": {
                    "title": "车辆传感器状态"
                },
                "component": () => import("@/view/doorMagnetic")
            }, {
                "path": "queryAlarm",
                "name": "queryAlarm",
                "meta": {
                    "title": "预警信息查询"
                },
                "component": () => import("@/view/queryAlarm")
            }
        ]
    }, {
        "path": "/manageInformation",
        "name": "manageInformation",
        "component": Main,
        "meta": {
            "title": "信息管理",
            "icon": "icon_menu_information",
            "showAlways": true
        },
        "children": [
            {
                "path": "queryVehicle",
                "name": "queryVehicle",
                "meta": {
                    "title": "车辆管理"
                },
                "component": () => import("@/view/queryVehicle")
            }, {
                "path": "manageFence",
                "name": "manageFence",
                "meta": {
                    "title": "电子围栏管理"
                },
                "component": () => import("@/view/manageFence")
            }, {
                "path": "addFence",
                "name": "addFence",
                "meta": {
                    "title": "新增电子围栏",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/addFence")
            }, {
                "path": "editFence",
                "name": "editFence",
                "meta": {
                    "title": "编辑电子围栏",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/editFence")
            }, {
                "path": "fenceDetail",
                "name": "fenceDetail",
                "meta": {
                    "title": "电子围栏详情",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/fenceDetail")
            }, {
                "path": "routesManagement",
                "name": "routesManagement",
                "meta": {
                    "title": "行驶路线管理"
                },
                "component": () => import("@/view/messgeManagement/routesManagement")
            }, {
                "path": "addRoute",
                "name": "addRoute",
                "meta": {
                    "title": "新增行驶路线",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/messgeManagement/addRoute")
            }, {
                "path": "editRoute",
                "name": "editRoute",
                "meta": {
                    "title": "编辑行驶路线",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/messgeManagement/addRoute")
            }, {
                "path": "routeDetail",
                "name": "routeDetail",
                "meta": {
                    "title": "路线详情",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/routeDetail")
            }
        ]
    },{
        "path": "/localVideoResource",
        "name": "localVideoResource",
        "component": Main,
        "meta": {
            "title": "本地视频资源",
            "icon": "icon_menu_video",
            "showAlways": true
        }, 
        "children": [
            {
                "path": "historyVideoPlayback",
                "name": "historyVideoPlayback",
                "meta": {
                    "title": "历史视频回放"
                },
                "component": () => import("@/view/localVideoResource/historyVideoPlayback")
            }
        ]
    }, {
        "path": "/systemSettings",
        "name": "systemSettings",
        "component": Main,
        "meta": {
            "title": "系统设置",
            "hideInBread": true
        },
        "children": [
            {
                "path": "accountManagement",
                "name": "accountManagement",
                "meta": {
                    "title": "账号管理",
                    "icon": "icon_menu_account"

                },
                "component": () => import("@/view/accountManagement")
            },{
                "path": "/downExport",
                "name": "downExport",
                "meta": {
                    "title": "下载中心",
                    "hideInMenu": true,
                    "isAccess": true
                },
                "component": () => import("@/view/downExport")
            }
        ]
    }, {
        "path": "/401",
        "name": "error_401",
        "meta": {
            "hideInMenu": true
        },
        "component": () => import("@/view/error-page/401.vue")
    }, {
        "path": "*",
        "name": "error_404",
        "meta": {
            "hideInMenu": true
        },
        "component": () => import("@/view/error-page/404.vue")
    }

];
