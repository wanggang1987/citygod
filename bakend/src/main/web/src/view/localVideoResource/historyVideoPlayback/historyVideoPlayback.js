import * as yd from "@/libs/yd";
import * as SubConfig from "@/libs/SubConfig";
import spinShow from "_c/loading-spin";
import { generateList } from "@/libs/tools";
import tableBase from "_m/tableBase";
import playVideoModal from "./components/playVideoModal";
import carLicenseAutoComplete from "_c/autoComplete/carLicense";
import enterpriseAutoComplete from "_c/autoComplete/enterprise";

export default {
    "name": "historyVideoPlayback",
    "mixins": [tableBase],
    "components": {
        "loading-spining": spinShow,
        "play-video-modal": playVideoModal,
        "carlincense-auto-complete": carLicenseAutoComplete,
        "enterprise-auto-complete": enterpriseAutoComplete
    },
    data () {
        const self = this;
        return {
            "showModal": false,
            "tableData": [],
            "interval": false,
            "videoData": [],
            "vehicleId": "", //车辆id
            "companyId": "", //企业id
            "enterpriseName": "", //企业名称
            "docNum": "", //单证号
            "uploadTask": "-1",
            "finishUploadTask": generateList(SubConfig.finishUploadTask), //完成上传任务
            "carState": "-1",
            "nowCarState": generateList(SubConfig.nowCarState), //当前车辆状态
            "doctype": "-1",
            "documentType": generateList(SubConfig.documentType), //单证类型
            "startTime": [], // 在途开始时间
            "endTime": [], // 在途结束时间
            "columns": [
                {
                    "title": "序号",
                    "minWidth": 80,
                    "fixed": "left",
                    "render": (h, params) => {
                        return params.index + (self.pageNo - 1) * self.pageSize + 1;
                    }
                },{
                    "title": "车牌号",
                    "key": "carLicense",
                    "minWidth": 120,
                    "fixed": "left",
                    "render": (h, params) => {
                        let carLicense = params.row.carLicense;
                        const plateColor = SubConfig.plateColor[params.row.plateColor];
                        carLicense = plateColor ? `${carLicense} ${plateColor}` : carLicense;
                        return self.tooltipRender(h, carLicense);
                    }
                },{
                    "title": "单证号",
                    "key": "waybillNo",
                    "tooltip": true,
                    "minWidth": 150,
                    "fixed": "left",
                    "render": (h, params) => {
                        return params.row.waybillNo ? params.row.waybillNo : "--";
                    }
                },{
                    "title": "完成上传任务",
                    "key": "ifUpload",
                    "tooltip": true,
                    "minWidth": 120,
                    "fixed": "left",
                    "render": (h, params) => {
                        return params.row.ifUpload || params.row.ifUpload === 0 ? SubConfig.finishUploadTask[params.row.ifUpload] : "--";
                    }
                },{
                    "title": "上传进度",
                    "key": "uploadList",
                    "tooltip": true,
                    "minWidth": 280,
                    "render": (h, params) => {
                        let progress = params.row.uploadList;
                        let progsContent = [];
                        let userId = window.localStorage.getItem("_user");
                        progress.forEach((item)=>{
                            progsContent.push(h("div",{
                                "class": "fs12",
                                "style": {
                                    "height": "24px",
                                    "line-height": "24px"
                                }
                            },[
                                h("span",{ "class": "dib" }, SubConfig.videoChannel[item.channel] + "："),
                                item.status != 2 ?
                                    h("Progress",{
                                        "style": {
                                            "width": "150px"
                                        },
                                        "class": "dib" ,
                                        "props": {
                                            "stroke-width": 8,
                                            "percent": item.uploadPercent,
                                            "stroke-color": ["#F0F2F5"]
                                        }  
                                    },[h("span",{"style": {"color": "#808695" }} ,item.uploadPercent + "%")]) : 
                                    h("span",{
                                        "style": {
                                            "width": "150px"
                                        },
                                        "class": "dib"
                                    },[
                                        h("Icon",{
                                            "props": {
                                                "color": "red",
                                                "type": "ios-close-circle"
                                            },
                                            "style": {
                                                "margin-right": "6px"
                                            }
                                        }),
                                        "上传失败！"
                                    ]),
                                    
                                h("span",item.status == 2 ? [ userId == "admin" ? h("a",{
                                    "style": {"color": "#2059EF" },
                                    "on": {
                                        "click": () => {
                                            if (params.row.vehicleStatus == 0) return self.$Message.error("当前车辆不在线，无法重新上传");
                                            self.$Modal.confirm({
                                                "title": "确认要重新上传该视频吗？",
                                                "onOk": () => {
                                                    self.againUpload( item );
                                                }
                                            });
                                        }
                                    }
                                },"重新上传") : ""] : ((item.status == 4 || item.status == 5)? [h("a",{
                                    "style": {"color": "#2059EF" },
                                    "on": {
                                        "click": () => {
                                            self.view(item, progress);
                                        }
                                    }
                                },"播放")] : ""))
                            ]));
                        });
                        
                        return h("div",progsContent);
                    }
                },{
                    "title": "当前车辆状态",
                    "key": "vehicleStatus",
                    "tooltip": true,
                    "minWidth": 110,
                    "render": (h, params) => {
                        return params.row.vehicleStatus || params.row.vehicleStatus === 0 ? SubConfig.nowCarState[params.row.vehicleStatus] : "--";
                    }
                },{
                    "title": "在途开始时间",
                    "key": "startTime",
                    "tooltip": true,
                    "minWidth": 170,
                    "render": (h, params) => {
                        return params.row.startTime ? new Date(params.row.startTime).Format("yyyy-MM-dd hh:mm:ss") : "--";
                    }
                },{
                    "title": "在途结束时间",
                    "key": "endTime",
                    "tooltip": true,
                    "minWidth": 170,
                    "render": (h, params) => {
                        return params.row.endTime ? new Date(params.row.endTime).Format("yyyy-MM-dd hh:mm:ss") : "--";
                    }
                },{
                    "title": "单证类型",
                    "key": "documentType",
                    "tooltip": true,
                    "minWidth": 120,
                    "render": (h, params) => {
                        return params.row.documentType ? SubConfig.documentType[params.row.documentType] : "--";
                    }
                },{
                    "title": "行驶方向",
                    "key": "travelDirection",
                    "tooltip": true,
                    "minWidth": 200,
                    "render": (h, params) => {
                        return params.row.travelDirection ? params.row.travelDirection : "--";
                    }
                },{
                    "title": "行驶路线",
                    "key": "travelRoute",
                    "tooltip": true,
                    "minWidth": 200,
                    "render": (h, params) => {
                        return self.tooltipRender(h, params.row.travelRoute);
                    }
                },{
                    "title": "企业名称",
                    "key": "companyName",
                    "tooltip": true,
                    "minWidth": 200,
                    "render": (h, params) => {
                        return self.tooltipRender(h, params.row.companyName);
                    }
                }
            ]
        };
    },
    mounted() {
        this.search();
    },
    "methods": {
        search (){
            const self = this;
            self.pageNo = 1;
            self.pageSize = 15;
            self.params = {
                "vehicleId": self.vehicleId || null,
                "companyId": self.companyId || null,
                "waybillNo": self.docNum || null,
                "ifUpload": self.uploadTask != "-1" ? self.uploadTask : null,
                "vehicleStatus": self.carState != "-1" ? self.carState : null,
                "documentType": self.doctype != "-1" ? self.doctype : null,
                "onwayStartStartTime": self.startTime[0] ? new Date(self.startTime[0]).getTime() : null,
                "onwayStartEndTime": self.startTime[1] ? new Date(self.startTime[1]).getTime() : null,
                "onwayEndStartTime": self.endTime[0] ? new Date(self.endTime[0]).getTime() : null,
                "onwayEndEndTime": self.endTime[1] ? new Date(self.endTime[1]).getTime() : null
            };
            self.loadTable();
            self.reloadPage();
        },
        loadTable () {
            const self = this;
            clearInterval(self.interval);
            self.spinShow = true;
            let params = {
                ...self.params,
                "pageNo": self.pageNo,
                "pageSize": self.pageSize
            };
            yd.ajax({
                "url": "../apiprovince/waybill/historyVideoReplayQueryPage",
                "type": "POST",
                "data": params,
                success (json) {
                    self.spinShow = false;
                    self.total = json.count || 0;
                    self.tableData = json.list || [];
                    // 实时监听进度条
                    self.interval = setInterval(() => {
                        self.reloadPage();
                    }, 120000);
                },
                error () {
                    self.spinShow = false;
                    self.tableData = [];
                    self.total = 0;
                }
            });
        },
        //企业输入联想
        changeEnterprise (id) {
            this.companyId = id;
        },
        changecarLicense (id) {
            this.vehicleId = id;
        },
        view ({ status, channel }, progress) {
            const self = this;
            if (status == 5) return self.$Message.error("视频已被清理");
            let arr = [];
            progress.forEach((item)=>{
                if ( item.status == 4 ) {
                    arr.push({
                        "channel": item.channel,
                        "fileName": item.fileName,
                        "flag": item.channel == channel
                    });
                }
            });
            self.videoData = arr;
            self.showModal = true;
            
        },
        againUpload (item) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/waybill/historyVideoReplayUploadAgain?id="+item.id,
                success (json) {
                    if ( json && json.success){
                        self.$Message.success("上传成功");
                        self.loadTable();
                    } else {
                        self.$Message.error("上传失败");
                    }
                },
                error () {
                    self.$Message.error("上传失败");
                }
            });
        },
        reloadPage () {
            const self = this;
            let map = {};
            let arr = [];
            self.tableData.forEach(item => {
                if (item.ifUpload === 1) return;
                arr.push(item.waybillNo);
                map[item.waybillNo] = item;
            });
            if (arr.length) {
                yd.ajax({
                    "url": "../apiprovince/waybill/queryWaybillHistoryVideoByWaybillNoBatch",
                    "type": "POST",
                    "data": {
                        "waybillNoList": arr
                    },
                    success (json = []) {
                        json.forEach((item, i)=>{
                            if (map[item.waybillNo]) {
                                self.$set(map[item.waybillNo], "uploadList", item.uploadList);
                                self.$set(map[item.waybillNo], "ifUpload", item.ifUpload);
                            }
                        });
                    }
                });
            } else {
                clearInterval(self.interval);
            }
        },
        startTimeChange (date, dateType) {
            if (dateType == "date"){
                this.startTime = [new Date(date[0]), new Date(new Date(date[1]).Format("yyyy-MM-dd 23:59:59"))];
            }
        },
        endTimeChange (date, dateType) {
            if (dateType == "date"){
                this.endTime = [new Date(date[0]), new Date(new Date(date[1]).Format("yyyy-MM-dd 23:59:59"))];
            }
        }
    }
};