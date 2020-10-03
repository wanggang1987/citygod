import $ from "jquery";
import axios from "axios";
import store from "@/store";
import router from "@/router";
import config from "@/config";


export const local = config.baseUrl;

axios.defaults.timeout = 30000;
axios.defaults.baseURL = config.baseUrl;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
        if (error.response.config.headers.CaptchaCode) { // 登录失败不处理
            //只有登录接口有CaptchaCode请求头
        } else { // token过期处理
            store.commit("setToken", "");
            router.push({
                "name": "login" // 跳转到登录页
            });
        }
    }
    return Promise.reject(error);
});
export const request = options => {
    options=$.extend(true, {}, {
        "headers": { 
            "Authorization": store.state.user.token// 请求头                                              
        }
    }, options);
    return axios.request(options);
};
export const ajax = options => {
    let requestParams = {
        ...options,
        "url": options.url,
        "method": options.type,
        "data": options.data,
        "cancelToken": options.cancelToken
    };
    if (options.type=="POST"||options.type=="post"){
        requestParams.data = options.data;
    } else {
        requestParams.params = options.data;
    }

    return new Promise((resovle, reject) => {
        request(requestParams).then(res => {
            if (res.status === 200) {
                const json = res.data;
                if (options.success) options.success(json);
                resovle(res);
            } else {
                reject(res);
            }
            if (options.complete) options.complete(res);
        }).catch(err => {
            if (!err.response) return console.error(err);
            if (options.error) options.error(err.response, err.response.status);
            reject(err);
            if (options.complete) options.complete(err.response);
        });
    });
};


//百度逆地址解析
export const getLocation = (dot, callBack, params) => {
    let lat = dot.lat;
    let lng = dot.lng;
    if (!params){
        let point = new BMap.Point(lng,lat);
        let geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs){
            callBack(rs ? rs.address : "", rs);
        });
    } else {
        //http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad
        let data={
            "ak": this.$config.ak,
            "location": [lat,lng].toString(),
            "output": "json",
            "s": 1
        };
        params=typeof params === "object"?$.extend(true,data,params):data;
        $.ajax({
            "type": "GET",
            "url": "https://api.map.baidu.com/reverse_geocoding/v3/",
            "data": params,
            "dataType": "JSONP",
            success (json) {
                let address="";
                if (!json.status) address=json.result.formatted_address + json.result.sematic_description;
                callBack(address || "", json.result);
            },
            error () {
                callBack("");
            }
        });
    }
};

export const getPoint = (address, callBack) => {
    let myGeo = new BMap.Geocoder();
    myGeo.getPoint(address, function(point){
        callBack(point ? point : "", address);
    });
};
export const openWindow = (path,params) => {
    router.push({
        "path": path.replace("..",""),
        "query": params
    });
};

//秒转换小时
export const parsedSecond = (time,params) => {
    let secondTime = parseInt(time);// 秒
    let minuteTime = 0;// 分
    let hourTime = 0;// 小时
    if (isNaN(secondTime)) return "";
    if (secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    let result = "" + parseInt(secondTime) + "秒";
    if (minuteTime > 0) result = "" + parseInt(minuteTime) + "分" + result;
    if (hourTime > 0) result = "" + parseInt(hourTime) + "小时" + result;
    return result;
};
export const angle = (angle) => {
    if (angle == 0 || angle == 360) {
        return "正北";
    }
    if (angle == 90) {
        return "正东";
    }
    if (angle == 180) {
        return "正南";
    }
    if (angle == 270) {
        return "正西";
    }
    if (angle > 0 && angle < 90) {
        return "北偏东" + angle + "°";
    }
    if (angle > 90 && angle < 180) {
        return "南偏东" + (180 - angle) + "°";
    }
    if (angle > 180 && angle < 270) {
        return "南偏西" + (angle - 180) + "°";
    }
    if (angle > 270 && angle < 360) {
        return "北偏西" + (360 - angle) + "°";
    }
};

/*日期格式化
  对Date的扩展，将 Date 转化为指定格式的String
  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
  例子： 
  (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
  (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
*/

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    {if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));}
    return fmt;
};

String.prototype.format = function () {
    if (arguments.length == 0) return this;
    let param = arguments[0];
    let s = this;
    if (typeof (param) == "object") {
        for (let key in param)
        {s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);}
        return s;
    } else {
        for (let i = 0; i < arguments.length; i++)
        {s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);}
        return s;
    }
};

//获取日期属于当年第几周
export const getWeekOfYear = (date) =>{//date为时间戳格式
    let today = new Date(date);
    let year = today.getFullYear();
    let firstDay = new Date(year,0, 1);
    let dayOfWeek = firstDay.getDay();
    let spendDay= 0;
    if (dayOfWeek !=1) {
        spendDay=7-(dayOfWeek||7)+1;
    }
    firstDay = new Date(year,0, 1+spendDay);
    let d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
    let result =Math.ceil(d/7);
    return {
        "year": year,
        "week": result+1
    };
};

//获取当年第几周有哪几天
export const getDaysByWeek = (year,week) => {
    let arr=[];
    let i;
    let firstDay = new Date(year,0, 1);
    let dayOfWeek = firstDay.getDay();
    let spendDay= 0;
    if (dayOfWeek !=1) {
        spendDay=7-(dayOfWeek||7)+1;
    }
    firstDay = new Date(year,0, 1+spendDay);
    let time=new Date(year,0,1).valueOf();
    if (week==1){
        let len=7;
        if (dayOfWeek!=1) len=7-dayOfWeek+1;
        for (i=0;i<len;i++){
            arr.push(new Date(time+(86400000*i)));
        }
    } else {
        for (i=0;i<7;i++){
            let day=(week-1);
            let date=new Date(time+(86400000*(day*7+(i-1))));
            if (date.getFullYear()==year) arr.push(date);
        }
    }
    return arr;
};

//把数字转换成带逗号分隔得数字，例子：999999999 转为 "999,999,999"
export const formatNum = (num) => {
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) { 
        return num; 
    }
    let a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
    let re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
    while (re.test(b)) b = b.replace(re, "$1,$2$3");
    return a + "" + b + "" + c;
};
//判断接口返回数据是否为空（不包含数据为0的情况，数据为0不应该视为空）
export const isNotNull = (value) => {
    if (value){
        return true;
    } else if (value === 0){
        return true;
    } else {
        return false;
    }
};

/**
 * JSON编解码
 * public method :
 *      json.encode(string)
 *      json.decode(object)
 */
export const json = new function () {
    let useHasOwn = !!{}.hasOwnProperty;
    let pad = function (n) {
        return n < 10 ? "0" + n : n;
    };
    let m = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
    };
    let encodeString = function (s) {
        if (/["\\\x00-\x1f]/.test(s)) {
            return "\"" + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                let c = m[b];
                if (c) {
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + "\"";
        }
        return "\"" + s + "\"";
    };
    let encodeArray = function (o) {
        let a = ["["],
            b, i, l = o.length,
            v;
        for (i = 0; i < l; i += 1) {
            v = o[i];
            switch (typeof v) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (b) {
                        a.push(",");
                    }
                    a.push(v === null ? "null" : json.decode(v));
                    b = true;
            }
        }
        a.push("]");
        return a.join("");
    };
    let encodeDate = function (o) {
        return "\"" + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + "\"";
    };
    this.decode = function (o) {
        if (typeof o == "undefined" || o === null) {
            return "null";
        } else if (o instanceof Array) {
            return encodeArray(o);
        } else if (o instanceof Date) {
            return encodeDate(o);
        } else if (typeof o == "string") {
            return encodeString(o);
        } else if (typeof o == "number") {
            return isFinite(o) ? String(o) : "null";
        } else if (typeof o == "boolean") {
            return String(o);
        } else {
            let a = ["{"],
                b, i, v;
            for (i in o) {
                if (!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(",");
                            }
                            a.push(this.decode(i), ":",
                                v === null ? "null" : this.decode(v));
                            b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };
    this.encode = function (json) {
        if (json == "") {//空字符串转对象会报错
            return {};
        } else {
            return eval("(" + json + ")");
        }

    };
}();
let Nibbler = function (options) {
    let construct, pad, dataBits, codeBits, keyString, arrayData, mask, group, max, gcd, translate, encode, decode,
        utf16to8, utf8to16;
    construct = function () {
        let i, mag, prev;
        pad = options.pad || "";
        dataBits = options.dataBits;
        codeBits = options.codeBits;
        keyString = options.keyString;
        arrayData = options.arrayData;
        mag = Math.max(dataBits, codeBits);
        prev = 0;
        mask = [];
        for (i = 0; i < mag; i += 1) {
            mask.push(prev);
            prev += prev + 1;
        }
        max = prev;
        group = dataBits / gcd(dataBits, codeBits);
    };
    gcd = function (a, b) {
        let t;
        while (b !== 0) {
            t = b;
            b = a % b;
            a = t;
        }
        return a;
    };
    encode = function (str) {
        str = utf16to8(str);
        let out = "",
            i = 0,
            len = str.length,
            c1, c2, c3, base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    };
    decode = function (str) {
        let c1, c2, c3, c4;
        let i, len, out;
        let base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) {
                    out = utf8to16(out);
                    return out;
                }
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) {
                    out = utf8to16(out);
                    return out;
                }
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        out = utf8to16(out);
        return out;
    };
    utf16to8 = function (str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    };
    utf8to16 = function (str) {
        let out, i, len, c;
        let char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    };
    this.encode = encode;
    this.decode = decode;
    construct();
};
export const Base64 = new Nibbler({
    "dataBits": 8,
    "codeBits": 6,
    "keyString": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    "pad": "="
});

//表格数据合计
export const combinedTable = (fixed) => {
    $(".combinedTable td:first-child").attr("colspan","2");
    $(".combinedTable td:first-child").css("text-align","center");
    ($($($(".combinedTable")[0]).find("td").get(1)).css("display","none"));
    if (fixed)($($($(".combinedTable")[1]).find("td").get(1)).css("display","none"));
};

//秒转换天
export const secToDay = (second_time) => {
    let day, hour, min, second = parseInt(second_time), time = "";
    if (parseInt(second_time) > 60) {

        second = parseInt(second_time) % 60;
        min = parseInt(second_time / 60);

        if (min > 60) {
            min = parseInt(second_time / 60) % 60;
            hour = parseInt(parseInt(second_time / 60) / 60);

            if (hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
            }
        }
    }
    if (day > 0) time += day + "天";
    if (hour > 0) time += hour + "小时";
    if (min > 0) time += min + "分";
    if (second > 0) time += second + "秒";
    return time || "0秒";
};

//毫秒转换天
export const msecToDay = (msecond_time) => {
    let second_time = parseInt(msecond_time/1000);
    return secToDay(second_time);
};


// 数字转换,没三位加一个“，”
export const conversionNumber = (num) => {
    num = (num || 0).toString();
    let result = "";
    while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result ;
};

export const exportFile = (url,params,method) => {
    const ActiveXObject = window.ActiveXObject;
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    url=local+url.replace("..","");
    params=params||{};
    method=(method||"GET").toUpperCase();
    if (method=="POST"){
        xhr.open("POST", url, true);// 也可以使用POST方式，根据接口
        // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
       
    } else {
        url=url+"?"+$.param(params);
        xhr.open("GET", url, true);// 也可以使用POST方式，根据接口
    }
    xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
    xhr.responseType = "blob";    // 返回类型blob

    //定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
            // 返回200
            let name=xhr.getResponseHeader("Content-Disposition");
            let filename=decodeURIComponent(escape(name)).replace(/\s*/g,"").replace("attachment;filename=","")||"下载";
            let blob = this.response;
            if (window.navigator.msSaveOrOpenBlob) {//ie
                navigator.msSaveBlob(blob, filename);
            } else {
                let a = document.createElement("a");
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } else {
            new Vue().$Message.error("下载失败！");
        }
    };
    // 发送ajax请求
    method=="POST"? xhr.send(JSON.stringify(params)):xhr.send();
};

// 根据身份证号获取出生日期
export const getBirth = (idCard) => {
    let birthday = "";
    if (idCard != null && idCard != ""){
        if (idCard.length == 15){
            birthday = "19" + idCard.slice(6,12);
        } else if (idCard.length == 18){
            birthday = idCard.slice(6,14);
        }   
        birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        //通过正则表达式来指定输出格式为:1990-01-01
    }   
    return birthday;
};

// 根据身份证号码获取性别
export const getSex = (idCard) => {
    let sexStr = "";
    if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
        sexStr = "男";
    }
    else {
        sexStr = "女";
    }
    return sexStr;
};


export const checkIdNumberValid = (tex) => {
    let tip = "输入的身份证号有误！";
    let num = tex;
    num = num.toUpperCase();
    let len, re;
    len = num.length;
    if (len == 0) return true;
 
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))){
        return false;
    }
 
    //验证前两位地区是否有效
    let aCity= {"11": "北京","12": "天津","13": "河北","14": "山西","15": "内蒙古","21": "辽宁","22": "吉林","23": "黑龙江","31": "上海",
        "32": "江苏","33": "浙江","34": "安徽","35": "福建","36": "江西","37": "山东","41": "河南","42": "湖北","43": "湖南",
        "44": "广东","45": "广西","46": "海南","50": "重庆","51": "四川","52": "贵州","53": "云南","54": "西藏","61": "陕西",
        "62": "甘肃","63": "青海","64": "宁夏","65": "新疆","71": "台湾","81": "香港","82": "澳门","91": "国外"};
 
    if (aCity[parseInt(num.substr(0,2))] == null){
        return false;
    }
 
    
    //当身份证为15位时的验证出生日期。
    if (len == 15){
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        //检查生日日期是否正确
        let arrSplit = num.match(re);
        let dtmBirth = new Date("19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay){
            return false;
        }
    }
 
    //当身份证号为18位时，校验出生日期和校验位。
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        //检查生日日期是否正确
        let arrSplit = num.match(re);
        let dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay){
            return false;
        } else {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            let valnum;
            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            let arrCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
            let nTemp = 0, i;
            for (i = 0; i < 17; i ++){
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)){
                return false;
            }
        }
    }
    return true;
};


export const getQuarter = (date) => {
    date = date || new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return {
        "year": year,
        "quarter": Math.ceil(month/3)
    };
};


export const download = (url, params, method) => {
    ajax({
        "url": url,
        "type": method || "GET",
        "data": params,
        success (json) {
            downloadResultsModal(json.success);
        }
    });
};

export const downloadResultsModal = function(flag) {
    const self = this;
    const $Modal = flag ? self.$Modal.success : self.$Modal.error;
    let content = "<i class=\"ivu-icon ivu-icon-ios-checkmark-circle fl fs24 pr10\" style=\"color:#19be6b;\"></i><p class=\"fs14\" style=\"line-height: 22px;color: #595959;\">创建数据导出任务成功，请前往<a class=\"ml4 mr4\" style=\"color: #0F55CF\" @click=\"open\"><Icon :size=\"20\" custom=\"iconfont icon_xiazaizhongxin mr4\" />下载中心</a>下载</p>";
    if (!flag) {
        content = "<i class=\"ivu-icon ivu-icon-ios-close-circle fl fs24 pr10\" style=\"color:#19be6b;\"></i><p class=\"fs14\" style=\"line-height: 22px;color: #595959;\">创建数据导出任务失败</p>";
    }
    $Modal({
        "render": (h) => {
            return h({
                "template": `<div class="pt32" style="height:70px;">${content}</div>`,
                "methods": {
                    open () {
                        router.push({
                            "name": "downExport"
                        });
                        this.$Modal.remove();
                    }
                }
            });
        },
        "okText": "知道了"
    });
};
