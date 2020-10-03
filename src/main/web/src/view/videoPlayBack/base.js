import * as SubConfig from "@/libs/SubConfig";

export const steamList = [
    {
        "value": 1,
        "label": "主码流"
    },{
        "value": 2,
        "label": "子码流"
    }
];

export const errorMsg = {
    "ResultCode_00000": "成功",
    "ResultCode_00001": "控制指令错误",
    "ResultCode_00002": "车辆不在线",
    "ResultCode_00003": "未找到停止的历史视频资源",
    "ResultCode_00004": "下发指令终端响应超时",
    "ResultCode_00005": "未找到车辆sim卡号",
    "ResultCode_00006": "回看时间不在历史视频资源时间范围内",
    "ResultCode_00007": "下发回放请求指令0x9201失败",
    "ResultCode_00008": "下发开始回放指令0x9202失败",
    "ResultCode_00009": "通道资源被占用",
    "ResultCode_99999": "未知错误"
};

export const renderChannelLabel = (channel) => {
    return channel ? (SubConfig.videoChannel[channel] || `通道${channel}`) : "--";
};


export const mixins = {
    "computed": {
        channelOperation () {
            return Object.keys(this.videoBackMap);
        },
        channelList () {
            let arr = [];
            this.channelOperation.forEach((channel) => {
                arr.push({
                    "value": channel,
                    "label": SubConfig.videoChannel[channel]
                });
            });
            return arr;
        },
        // 车辆行程回放资源信息
        videoBackDetail () {
            let arr = [];
            this.channelOperation.forEach((channel) => {
                const details = this.videoBackMap[channel][this.steam];
                arr.push({
                    "channel": channel,
                    "videoDetail": details
                });
            });
            return arr;
        }
    }
};