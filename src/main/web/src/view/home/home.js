import echarts from "echarts";
import $ from "jquery";
import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";

export default {
    "name": "home",
    data () {
        return {
            "iconProgressData": [
                {
                    "name": "在线车辆",
                    "color": "#0F55CF",
                    "icon": "icon_car_online",
                    "data": "0",
                    "all": "0"
                },{
                    "name": "离线车辆",
                    "color": "#555555",
                    "icon": "icon_car_offline",
                    "data": "0",
                    "all": "0"
                },{
                    "name": "预警车辆",
                    "color": "#ED4848",
                    "icon": "icon_car_alarm",
                    "data": "0",
                    "all": "0"
                }
            ],
            "vehicleColumns": [
                {
                    "title": "序号",
                    "width": 100,
                    "align": "center",
                    "render": (h, params) => {
                        return h("div", {
                            "style": {
                                "width": "20px",
                                "height": "20px",
                                "border-radius": "50%",
                                "text-align": "center",
                                "color": params.index < 3 ? "#fff" : "#333",
                                "background": params.index < 3 ? "#0F55CF" : "#F0F0F0",
                                "margin": "0 auto"
                            }
                        }, params.index + 1);
                    }
                }, {
                    "title": "车牌号",
                    "key": "carLicense",
                    "width": 120,
                    "render": (h, params) => {
                        return params.row.carLicense + " " + SubConfig.plateColor[params.row.plateColor];
                    }
                }, {
                    "title": "预警数",
                    "key": "alarmCount",
                    "align": "center",
                    "sortable": "custom",
                    "width": 120
                }, {
                    "title": "企业名称",
                    "key": "companyName"
                }
            ],
            "companyColumns": [
                {
                    "title": "序号",
                    "width": 100,
                    "align": "center",
                    "render": (h, params) => {
                        return h("div", {
                            "style": {
                                "width": "20px",
                                "height": "20px",
                                "border-radius": "50%",
                                "text-align": "center",
                                "color": params.index < 3 ? "#fff" : "#333",
                                "background": params.index < 3 ? "#0F55CF" : "#F0F0F0",
                                "margin": "0 auto"
                            }
                        }, params.index + 1);
                    }
                }, {
                    "title": "企业名称",
                    "key": "companyName"

                }, {
                    "title": "预警数",
                    "key": "alarmCount",
                    "width": 120,
                    "sortable": "custom"
                }
            ],
            "vehicleData": [],
            "companyData": []
        };
    },
    mounted () {
        const self = this;
        self.pie1 = echarts.init(document.getElementById("alarmTypeAnalysis"));
        self.pie2 = echarts.init(document.getElementById("alarmHandleStatus"));
        self.barChart = echarts.init(document.getElementById("alarm7days"));
        self.loadVehicleMsg();
        self.loadPie1Data();
        self.loadBarData();
        self.loadVehicleList();
        self.loadCompanyList();
        window.onresize = function() {
            self.pie1.resize();
            self.pie2.resize();
            self.barChart.resize();
        };

    },
    "methods": {
        loadVehicleMsg () {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/getVehicleSurvey",
                success (data) {
                    self.iconProgressData = [
                        {
                            "name": "在线车辆",
                            "color": "#0F55CF",
                            "icon": "icon_car_online",
                            "data": data.onlineVehicleCount,
                            "all": data.totalVehicleCount
                        }, {
                            "name": "离线车辆",
                            "color": "#555555",
                            "icon": "icon_car_offline",
                            "data": data.offlineVehicleCount,
                            "all": data.totalVehicleCount
                        }, {
                            "name": "预警车辆",
                            "color": "#ED4848",
                            "icon": "icon_car_alarm",
                            "data": data.notHandleVehicleCount,
                            "all": data.totalVehicleCount
                        }
                    ];
                }
            });
        },
        loadPie1Data () {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/selectVehicleAlarmAnalysisHandle",
                success (data) {
                    self.alarmTypeAnalysis(data);
                    self.alarmHandleStatus(data);
                }
            });
        },
        loadBarData () {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/selectLatestAlarm",
                success (data) {
                    self.alarm7days(data);
                }
            });
        },
        loadVehicleList (sortType) {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/selectTopVehicle",
                "data": {
                    "sortType": sortType ? sortType == "normal" ? "" : sortType.toUpperCase() : "ASC"
                },
                success (data) {
                    self.vehicleData = data;
                }
            });
        },
        loadCompanyList (sortType) {
            const self = this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/selectTopCompany",
                "data": {
                    "sortType": sortType ? sortType == "normal" ? "" : sortType.toUpperCase() : "ASC"
                },
                success(data) {
                    self.companyData = data;
                }
            });
        },
        alarmTypeAnalysis (val) {
            const self = this;
            const colorMap = {
                "40001": "#FACC14",
                "40002": "#0F55CF",
                "40003": "#2FC25B",
                "40005": "#1890FF"
            };
            let data = [], legend = [];
            SubConfig.earlyWarnType.forEach((item) => {
                const key = `type${item}`;
                data.push({
                    "value": val[key],
                    "name": SubConfig.alarmType[item],
                    "itemStyle": {
                        "normal": {
                            "color": colorMap[item]
                        }
                    },
                    "label": {
                        "formatter": [
                            "{div|{b}}",
                            "{div|{c}({d}%)}"
                        ].join("\n"),
                        "rich": {
                            "div": {
                                "color": "#333",
                                "align": "left",
                                "fontSize": 14,
                                "height": 19
                            }
                        }
                    }
                });
                legend.unshift(SubConfig.alarmType[item]);
            });
            let option = {

                "legend": {
                    "icon": "circle",
                    "selectedMode": false, //取消图例上的点击事件
                    "orient": "horizontal",
                    "x": "center",
                    "y": "85%",
                    "itemWidth": 10,
                    "itemHeight": 10,
                    "data": legend,
                    "textStyle": {
                        "fontSize": 14
                    }
                },
                "tooltip": {},
                "series": [{
                    "type": "pie",
                    "radius": "50%",
                    "center": ["50%", "40%"],
                    "data": data,
                    "itemStyle": {
                        "normal": {
                            "color": "#0F55CF"
                        }

                    },
                    "labelLine": {
                        "normal": {
                            "show": true,
                            "length": 10,
                            "length2": 30
                        }
                    }
                }]
            };
            self.pie1.setOption(option);
        },
        alarmHandleStatus (val) {
            const self = this;
            let val2 = val.notHandleAlarmCount,
                val1 = val.handleAlarmCount;
            let data = [{
                "value": val1,
                "name": "已处理"
            },
            {
                "value": val2,
                "name": "未处理",
                "itemStyle": {
                    "normal": {
                        "color": "#ED4848"
                    }
                }
            }
            ];
            for (let i in data) {
                data[i].label = {
                    "formatter": [
                        "{div|{b}}",
                        "{div|{c}({d}%)}"
                    ].join("\n"),
                    "rich": {
                        "div": {
                            "color": "#333",
                            "align": "left",
                            "fontSize": 14,
                            "height": 19
                        }
                    }
                };
            }
            let option = {
                "title": {
                    "text": val.totalAlarmCount,
                    "subtext": "预警总数",
                    "left": "center",
                    "top": "36%",
                    "textStyle": {
                        "lineHeight": 10,
                        "fontSize": 24,
                        "fontWeight": 500
                    },
                    "subtextStyle": {
                        "color": "#333",
                        "height": 19,
                        "margin": 0

                    }
                },
                "legend": {
                    "icon": "circle",
                    "selectedMode": false, //取消图例上的点击事件
                    "orient": "horizontal",
                    "x": "center",
                    "y": "85%",
                    "itemGap": 50,
                    "itemWidth": 10,
                    "itemHeight": 10,
                    "textStyle": {
                        "fontSize": 14
                    }
                },
                "tooltip": {},

                "series": [{
                    "type": "pie",
                    "radius": ["36%", "50%"],
                    "center": ["50%", "40%"],
                    "data": data,
                    "itemStyle": {
                        "normal": {
                            "color": "#0F55CF"
                        }

                    },
                    "labelLine": {
                        "normal": {
                            "show": true,
                            "length": 10,
                            "length2": 30
                        }
                    }
                }]
            };
            self.pie2.setOption(option);
        },
        alarm7days (data) {
            const self = this;
            let xAxis = [],
                yAxis = [];
            for (let i in data) {
                xAxis.push(data[i].statDay);
                yAxis.push(data[i].alarmCount);
            }
            let option = {
                "color": ["#2059EF"],
                "tooltip": {
                    "formatter": "{b} : <br/> <i style='display:inline-block;width:8px;height:8px;margin-right:4px;background:#0F55CF;border-radius:50%'></i>预警数 : {c}"

                },
                "grid": {
                    "left": "3%",
                    "right": "3%",
                    "bottom": "3%",
                    "containLabel": true
                },
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        "lineStyle": {
                            "color": "#f0f0f0"
                        }
                    },
                    "axisLabel": {
                        "color": "#666"
                    },
                    "data": xAxis

                }],
                "yAxis": [{
                    "type": "value",
                    "name": "",
                    "nameTextStyle": {
                        "color": "#666"
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#fff"
                        }
                    },
                    "splitLine": {
                        "show": true,
                        "lineStyle": {
                            "color": ["#f0f0f0"],
                            "width": 1,
                            "type": "dashed"
                        }
                    },
                    "axisLabel": {
                        "color": "#666"
                    }
                }

                ],
                "series": [{
                    "type": "bar",
                    "barWidth": 30,
                    "itemStyle": {
                        "color": "#0F55CF"
                    },
                    "emphasis": {
                        "itemStyle": {
                            "color": "#3E77D6"
                        }
                    },
                    "label": {
                        "show": true,
                        "position": "top",
                        "textStyle": {
                            "color": "#333"
                        }
                    },
                    "data": yAxis
                }]
            };
            self.barChart.setOption(option);
        },
        sortCompany (type) {
            this.loadCompanyList(type.order);
        },
        sortVehicle (type) {
            this.loadVehicleList(type.order);
        }
    }
};