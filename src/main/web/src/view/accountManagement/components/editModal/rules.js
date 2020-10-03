import { checkIdNumberValid } from "@/libs/yd";
const checkName = (value) => {
    if (value.length > 20 || value.length < 4) return false;
    const zg =  /^[0-9a-zA-Z]*$/; 
    if (!zg.test(value))  {  
        return false;  
    } else {  
        return true;  
    }  
};

const checkPasswd = (value) => {
    if (value.length > 20 || value.length < 8) return false;
    const zg =  /^[0-9a-zA-Z]*$/; 
    if (!zg.test(value))  {  
        return false;  
    } else {  
        return true;  
    }  
};

export default {
    "name": [
        {
            "required": true, 
            "trigger": "blur",
            validator (rule, value, callback) {
                if (!value) {
                    return callback(new Error("账号不能为空"));
                } else if (!checkName(value)) {
                    return callback(new Error("账号格式为4~20位数字&字母"));
                } else {
                    return callback();
                }
            }
        }
    ],
    "passwd": [
        {
            "required": true, 
            "trigger": "blur",
            validator (rule, value, callback) {
                if (!value) {
                    return callback(new Error("密码不能为空"));
                } else if (!checkPasswd(value)) {
                    return callback(new Error("密码格式为8~20位数字&字母"));
                } else {
                    return callback();
                }
            }
        }
    ]
};