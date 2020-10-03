import $ from "jquery";
import * as SubConfig from "@/libs/SubConfig";
import * as yd from "@/libs/yd";

export default {
    "name": "TreeSelect",
    "props": {
        "value": {
            "type": Array,
            default () {
                return [];
            }
        },
        "hiddenInput": {
            "type": Boolean,
            "default": false
        },
        "placeholder": {
            "type": String,
            "default": ""
        },
        "width": {
            "type": [Number, String]
        },
        "editable": {
            "type": Boolean,
            "default": false
        },
        "disabled": {
            "type": Boolean,
            "default": false
        }
    },
    data () {
        return {
            "visible": false,
            "offsetWidth": this.width || 200,
            "title": "", // 展示信息
            "key": "", // 搜索值
            "typesData": [], // 储存最终节点数据
            "treeData": [],
            "nodes": [], // 储存节点
            "timer": "",
            "originData": [], // 储存选择数据
            "map": {}
        };
    },
    "watch": {
        value (newVal, oldVal) {
            const self = this;
            self.nodes.forEach((item) => {
                self.$set(item, "checked", false);
                self.$set(item, "indeterminate", false);
            });
            self.typesData.forEach((item) => {
                if (newVal.indexOf(item.id) !== -1) {
                    self.$set(item, "checked", true);
                } else {
                    self.$set(item, "checked", false);
                }
            });
            self.changeTitle(newVal);
        },
        key (newVal, oldVal) {
            const self = this;
            clearTimeout(self.timer);
            self.timer = setTimeout(() => {
                self.searchTree(newVal);
            }, 500);
        },
        visible (newVal, oldVal) {
            if (!newVal) return;
            const offsetWidth = this.$refs.drop.$el.offsetWidth;
            this.offsetWidth = this.width && this.width - offsetWidth > 0 ? this.width : offsetWidth;
        }
    },
    created () {
        this.init();
    },
    "methods": {
        init () {
            // 初始化方法
            const self = this;
        },
        clean () {
            const self = this;
            if (self.disabled) return;
            self.title = "";
            self.key = "";
            self.$emit("on-check-change", []);
            self.$emit("input", []);
            self.nodes.forEach((item) => {
                self.$set(item, "checked", false);
            });
        },
        render () {
            const self = this;
            let root = {
                "title": "全部",
                "expand": true,
                "children": []
            };
            self.typesData = [];
            self.nodes = [];
            self.originData.forEach((item, i) => {
                if (item.children) {
                    let obj = {
                        "title": item.title,
                        "id": item.id,
                        "expand": false,
                        "children": []
                    };
                    item.children.forEach((curItem, index) => {
                        let child = {
                            "title": curItem.title,
                            "id": curItem.id,
                            "parentId": item.id,
                            "checked": curItem.checked || false
                        };
                        self.map[curItem.id] = curItem;
                        if (self.value.indexOf(curItem.id) !== -1) child.checked = true;
                        obj.children.push(child);
                        self.typesData.push(child);
                        self.nodes.push(child);
                    });
                    root.children.push(obj);
                    self.nodes.push(obj);
                } else {
                    let obj = {
                        "title": item.title,
                        "id": item.id,
                        "checked": item.checked || false
                    };
                    self.map[item.id] = item;
                    if (self.value.indexOf(item.id) !== -1) obj.checked = true;
                    self.typesData.push(obj);
                    root.children.push(obj);
                    self.nodes.push(obj);
                }
            });
            self.nodes.push(root);
            self.treeData=[root];
            self.changeTitle(self.value);
        },
        searchTree (key) {
            const self = this;
            if (key.length) {
                self.search();
            } else {
                self.render();
            }
        },
        search () {
            const self = this;
            self.treeData = self.typesData.filter((item, i) => {
                const regex=new RegExp(self.key, "i");
                return item.title.search(regex) != -1;
            });
        },
        checkChange (val, currentItem) {
            const self = this;
            let arr = [];
            let types = [];
            self.typesData.forEach((item, i) => {
                if (!item.checked) return;
                arr.push(item);
                types.push(item.id);
            });
            self.$emit("on-check-change",arr);
            self.changeTitle(types);
            self.$emit("input", types);
        },
        changeTitle (data) {
            const self = this;
            const len = data.length;
            const id = data[0];
            self.title = len ? (len > 1 ? `已选择${ len }个${ self.placeholder }类型` : self.map[id].title) : "";
        },
        visibleShow () {
            this.visible = true;
            setTimeout(() => {
                // $nextTick会导致页面闪烁
                this.$refs.input.focus();
            }, 50);
        },
        handleClose(e) {
            if (e && e.path) {
                const paths = e.path.filter((item) => {
                    return item.className == "treeSelectBody";
                });
                if (paths.length) return;
            }

            this.visible = false;
            if (this.disabled) return;
            
        }

    }
};