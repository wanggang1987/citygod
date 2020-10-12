//报警类型
export const alarmType = {
    "40001": "传感器异常开启",
    "40002": "行驶路线偏离",
    "40003": "行驶超出规定时间",
    "40005": "脱离监管"
};

// 预警信息查询 - 预警类型
export const earlyWarnType = ["40001", "40002", "40003", "40005"];

// 车牌颜色
export const plateColor =  {
    "1": "蓝",
    "2": "黄",
    "3": "黑",
    "4": "白",
    "5": "绿",
    "6": "黄绿",
    "9": ""
};
//报警等级
export const levelreturn =  {
    "1": "一级",
    "2": "二级",
    "3": "三级",
    "4": "四级"
};

//报警处理状态
export const handleStatus = {
    "0": "未处理",
    "1": "已处理"
};

//围栏状态
export const fenceStatus = {
    "1": "启用",
    "0": "禁用"
};

// 单证类型
export const documentType = {
    "1": "在途监管单"
};

// 码流类型
export const steamType = {
    "1": "主码流",
    "2": "子码流"
};

// 视频通道
export const videoChannel = {
    "1": "ADAS（人脸）",
    "2": "车前方",
    "3": "驾驶室",
    "4": "门通道",
    "5": "左后方",
    "6": "右后方"
};

//传感器状态
export const magnetismStatus = {
    "0": "打开",
    "1": "关闭"
};

// 完成上传任务
export const finishUploadTask = {
    "0": "否",
    "1": "是"
};

// 当前车辆状态
export const nowCarState = {
    "0": "离线",
    "1": "在线"
};