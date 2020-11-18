<template>
<div class="card">
    <div class="caption">
        <span class="icon icon3"></span>进出场次数排名
    </div>
    <div class="pane pl24 pr24 pt24 pb24" style="height: calc(100% - 51px);">
        <div v-show="showFlag" id="rankInAndOut" style="height: 100%;"></div>
        <div v-show="!showFlag" class="noData" style="height: 100%">
            <div class="noDataText">
                <i class="iconfont icon_no_data"></i> <br>
                暂无数据
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as yd from "@/libs/yd";
import echarts from "echarts";

export default {
    "name": "rankInAndOut",
    "props": {
        "token": {
            "type": String
        }
    },
    data () {
        return {
            "showFlag": true
        };
    },
    mounted () {
        this.query();
    },
    "methods": {
        query () {
            const self = this;
            let x = [];
            let y = [];
            yd.ajax({
                "url": "../apiprovince/bigScreen/vehicleAccessStatistics",
                "headers": { 
                    "Authorization": self.token// 请求头                                              
                },
                success (json = []) {
                    self.showFlag = !!json.length;
                    json.forEach((item) => {
                        x.unshift(item.totalStatistics);
                        y.unshift(item.carLicense);
                    });
                    self.render(y, x);
                }
            });
        },
        render (yAxisData, seriesData) {
            const self = this;
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("rankInAndOut"));
            // 指定图表的配置项和数据
            let option = {
                "grid": { //绘图区调整
                    "x": 80, //左留白
                    "y": 0, //上留白
                    "x2": 24, //右留白
                    "y2": 0 //下留白
                },
                "xAxis": [{
                    "show": false
                }],
                "yAxis": [{
                    "type": "category",
                    "data": yAxisData,
                    "axisLine": {
                        "show": false
                    },
                    //坐标轴
                    "axisTick": [{ //坐标轴小标记
                        "show": false
                    }],
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": "14",
                            "color": "#fff"
                        }
                    }
                }],
                "series": [{
                    "type": "bar",
                    "tooltip": {
                        "show": false
                    },
                    "barMinHeight": 10,
                    //最小柱高
                    "barWidth": 20,
                    //柱宽度
                    "data": seriesData,
                    "itemStyle": {
                        "normal": { //柱状图颜色
                            "color": ({ dataIndex }) => {
                                let startColor = "#2045CD";
                                let endColor = "#4796F7";
                                if (dataIndex == seriesData.length - 1) {
                                    startColor = "#C9623B";
                                    endColor = "#D2B53C";
                                }
                                const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        "offset": 0,
                                        "color": startColor
                                    }, {
                                        "offset": 1,
                                        "color": endColor
                                    }
                                ]);
                                return color;

                            },
                            "label": {
                                "show": true,
                                //显示文本
                                "position": "right",
                                //数据值位置
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": "14"
                                }
                            }
                        }
                    }
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    }
};
    
</script>