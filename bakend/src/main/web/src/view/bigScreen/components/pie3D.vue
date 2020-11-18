<template>
    <div class="panel" :style="{'height': height}">
        <div class="panel-title">
            <span class="icon icon2"></span>报警异常占比
        </div>
        <div v-show="show" id="piePanel" :style="{'height': 'calc(100% - 50px)'}"></div>
        <div v-show="!show" class="noData" :style="{'height': 'calc(100% - 50px)'}">
            <div class="noDataText">
                <i class="iconfont icon_no_data"></i> <br>
                暂无数据
            </div>
        </div>
        <div class="panel-footer"></div>
    </div>
</template>

<script>
import * as Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import * as yd from "@/libs/yd";

Highcharts3D(Highcharts);
export default {
    "name": "pie3D",
    "props": {
        "height": {
            "type": String,
            "default": "300px"
        },
        "token": {
            "type": String,
            "default": ""
        }
    },
    data (){
        return {
            "show": true
        };
    },
    mounted () {
        let self=this;
        self.loadData();
    },
    "methods": {
        loadData(){
            let self=this;
            yd.ajax({
                "url": "/apiprovince/haiguanHomePage/selectVehicleAlarmAnalysisHandle",
                "headers": {
                    "Authorization": self.token
                },
                success (json){
                    if (json.type40001==0&&json.type40003==0&&json.type40002==0){
                        self.show=false;
                    } else {
                        self.show=true;
                        self.loadPie(json);
                    }
                }
            });

        },
        loadPie (val){
            let color=[
                {"dark": "#F3BC41","light": "#F9DE5C"},
                {"dark": "#3A7AE9","light": "#4796F7"},
                {"dark": "#65E1FF","light": "#6FDCF9"},
                {"dark": "#6341F3","light": "#8652F4"}];

            let data = [
                {"y": val.type40001, "name": "传感器异常开启"},
                {"y": val.type40005, "name": "脱离监管"},
                {"y": val.type40003, "name": "行驶超出规定时间"},
                {"y": val.type40002, "name": "行驶路线偏离"}
            ];
            Highcharts.getOptions().colors = Highcharts.map(color, function(coloritem) {
                return {
                    "radialGradient": { "cx": 0, "cy": 0.7, "r": 0.5 },
                    "stops": [
                        [0,  Highcharts.Color(coloritem.dark).brighten(-0.1).get("rgb")],
                        [1,  coloritem.light] // darken
                    ]
                };
            });
            let chart = Highcharts.chart("piePanel", {
                "chart": {
                    "type": "pie",
                    "backgroundColor": "rgba(0,0,0,0)",
                    "options3d": {
                        "enabled": true,
                        "alpha": 60,
                        "beta": 0
                    }
                },
                "credits": {
                    "enabled": false
                },
                "title": {
                    "text": ""
                },
                "tooltip": {
                    // "pointFormatter": function () {
                    //     return "<div style='font-size: 14px'>" +this.name+":<br/><div style='color:"+this.color.stops[1][1]+"'>"+this.percentage.toFixed(1)+"%</div></div>";
                    //
                    // }
                    "formatter": function () {
                        return "<div style='font-size: 14px'>" +this.point.name+":<br/><div style='font-weight: bold'>"+this.point.percentage.toFixed(2)+"%</div></div>";
                    }
                },
                "plotOptions": {
                    "pie": {
                        "allowPointSelect": true,
                        "cursor": "pointer",
                        "depth": 80,//立体厚度
                        "dataLabels": {
                            "enabled": true,
                            "formatter": function () {
                                return "<div>" +this.point.name+":<br/><div style='color:"+this.point.color.stops[1][1]+";font-size: 16px'>"+this.point.percentage.toFixed(2)+"%</div></div>";
                            },
                            "color": "#fff"
                        }
                    }
                },
                "series": [{
                    "type": "pie",
                    "name": "",
                    "startAngle": -60,
                    "data": data
                }]
            });
        }

    }

};
</script>

<style scoped>

</style>