/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
    const keysArr1 = Object.keys(obj1);
    const keysArr2 = Object.keys(obj2);
    if (keysArr1.length !== keysArr2.length) return false;
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
    /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
};

export const forEach = (arr, fn) => {
    if (!arr.length || !fn) return;
    let i = -1;
    let len = arr.length;
    while (++i < len) {
        let item = arr[i];
        fn(item, i, arr);
    }
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {Object} map 对象
 * @param {Boolean} flag 枚举值是否有全部选项
 * @param {Boolean} isNumber 枚举值是否转换为数字
 * @description 将枚举值转换为select list
 */
export const generateList = (map, flag = true, isNumber) => {
    let arr = [
        {
            "value": isNumber ? -1 : "-1",
            "label": "全部"
        }
    ];
    if (!flag) arr = [];
    Object.keys(map).forEach((item) => {
        arr.push({
            "value": isNumber ? parseInt(item) : item,
            "label": map[item] || "其他"
        });
    });
    return arr;
};