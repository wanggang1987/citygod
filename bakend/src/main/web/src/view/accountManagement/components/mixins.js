export default {
    data () {
        return {
            "applications": [],
            "disabled": false
        };
    },
    "computed": {
        menuList () {
            return this.$store.getters.menuList;
        }
    },
    "methods": {
        queryTreeData (data) {
            const applications = this.applications;
            let arr = [];
            data.forEach((item) => {
                const title = item.meta.title;
                if (title == "账号管理") return;
                let obj = {
                    "title": title,
                    "expand": true,
                    "disabled": this.disabled,
                    "checked": this.applications.includes(title)
                };
                if (obj.title === "首页") {
                    obj.disabled = true;
                }
                if (item.children && item.children.length) {
                    const children = this.queryTreeData(item.children);
                    const flag = item.meta && item.meta.title && (item.children.length > 1 || item.meta.showAlways);
                    if (flag) {
                        obj.children = children;
                        arr.push(obj);
                    } else {
                        arr = arr.concat(children);
                    }
                } else {
                    arr.push(obj);
                }
            });
            return arr;
        }
    }
};