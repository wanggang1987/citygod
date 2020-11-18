export const transformTime = (str) => {
    const [hour, minute, second] = str.split(":");
    return parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
};

export const verTime = (startTime, endTime) => {
    startTime = transformTime(startTime);
    endTime = transformTime(endTime);
    const time = endTime - startTime;
    if (time <= 0) {
        return "结束时间必须大于开始时间";

    } else if (time > 300) {
        return "视频下载时间跨度不超过5分钟";
    }
    return "";
};
