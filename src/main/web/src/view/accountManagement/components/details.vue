<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="600" footer-hide :mask-closable="false">
    <div slot="header" class="pr header">账号管理<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <div class="mainBody" style="padding: 8px 24px;">
        <div class="clearfix pb8 ivu-row">
            <div class="clearfix">
                <span class="fl caption tar mr20" style="width: 70px;">账号：</span>
                <div class="detail">{{ name }}</div>
            </div>
            <div class="clearfix">
                <span class="fl caption tar">菜单权限：</span>
                <div class="detail fl" style="line-height: 1.5;width: calc(100% - 70px);overflow: auto;">
                    <Tree :data="treeData" show-checkbox></Tree>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer" class="footer">
        <i-button @click="cancel">取消</i-button>
        <i-button type="primary" :loading="loading" @click="ok">确定</i-button>
    </div>
</Modal>
</template>

<script>
import * as yd from "@/libs/yd";
import customModalBase from "_m/customModalBase";
import mixins from "./mixins";


export default {
    "name": "accountDetail",
    "mixins": [customModalBase, mixins],
    "props": {
        "id": {
            "type": String
        }
    },
    data () {
        return {
            "name": "--", // 账号
            "treeData": [],
            "disabled": true
        };
    },
    "methods": {
        init () {
            const self = this;
            self.query((json) =>{
                self.name = json.name || "--"; // 账号
                self.applications = json.applications || [];
                self.treeData = self.queryTreeData(this.menuList);
            });
        },
        query (callBack) {
            const self = this;
            yd.ajax({
                "url": "../apiprovince/account/queryAccountDetail",
                "data": {
                    "id": self.id
                },
                success (json) {
                    callBack(json || {});
                },
                error () {
                    callBack({});
                }
            });
        }
    }
};
</script>