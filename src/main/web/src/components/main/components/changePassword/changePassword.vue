<template>
    <Modal width="500px"  v-model="changePassword" class="changePasswordModal">
        <div slot="header" class="modal-header"><span>修改密码</span></div>
        <div class="modal-body">
            <form>
                <div class="form-item">
                    <label>原始密码</label>
                    <input type="password" v-model="oldPassword" placeholder=""></input>
                </div>
                <div class="form-item">
                    <label>新密码</label>
                    <input type="password" v-model="newPassword" placeholder=""></input>
                </div>
                <div class="form-item">
                    <label>重复密码</label>
                    <input type="password" v-model="repeatPassword" placeholder=""></input>
                </div>
            </form>
            <div class="modal-error" v-show="errorInfo"><Icon type="md-close-circle" class="ml8 mr8" size="16" color="red" />{{ errorInfo }}</div>
        </div>
        <div slot="footer" class="modal-footer">
            <i-button @click="cancel">取消</i-button>
            <i-button type="primary" @click="sure">确定</i-button>
        </div>
    </Modal>
</template>

<script>
import { mapActions } from "vuex";
import * as yd from "@/libs/yd";

export default {
    "name": "ChangePassword",
    "props": {
        "value": {
            "type": Boolean,
            "default": false
        }
    },
    "computed": {
        userName () {
            return this.$store.state.user.userName;
        }
    },
    "watch": {
        "value": function(newVal, oldVal){
            const self = this;
            self.changePassword = newVal;
        },
        "changePassword": function(newVal, oldVal){
            const self = this;
            if (newVal) self.init();
            self.$emit("input",newVal);
        }
    },
    data () {
        return {
            "changePassword": false, //modal
            "oldPassword": "", //原始密码
            "newPassword": "", //新密码
            "repeatPassword": "", //重复密码
            "errorInfo": ""
        };
    },
    mounted () {
        const self = this;
        self.modal = self.value;
    },
    "methods": {
        ...mapActions([
            "handleLogOut"
        ]),
        logout () {
            this.handleLogOut().then(() => {
                this.$router.push({
                    "name": "login"
                });
            });
        },
        init () {
            const self = this;
            self.oldPassword = "";
            self.newPassword = "";
            self.repeatPassword = "";
            self.errorInfo = "";
        },
        cancel () {
            this.changePassword = false;
        },
        sure () {
            const self = this;
            self.errorInfo = "";
            let params = {
                "name": self.userName,
                "oldPass": self.oldPassword,
                "passwd": self.newPassword
            };
            if (!params.oldPass){
                return self.errorInfo = "原始密码不为空";
            }
            if (!params.passwd){
                return self.errorInfo = "新密码不为空";
            }
            if (!/^\S{6,18}$/.test(params.passwd)){
                return self.errorInfo = "密码6-18位";
            } else {
                let a = params.passwd;
                let k = a.substring(0, 1);
                a = a.replace(new RegExp(k, "gm"), "");
                if (a.length == 0) {
                    return self.errorInfo = "登录密码强度太弱";
                }
                let count = 0;
                let t = params.passwd.charCodeAt(0) - params.passwd.charCodeAt(1);
                for (let i = 1, l = params.passwd.length; i < l - 1; i++){
                    if ((params.passwd.charCodeAt(i) - params.passwd.charCodeAt(i + 1)) == t) {
                        count = count+1;
                    }
                }
                if (params.passwd.length-2 == count){
                    return self.errorInfo = "登录密码强度太弱";
                }
            }
            if (!this.repeatPassword){
                return self.errorInfo = "重复密码不为空";
            }
            if (this.repeatPassword !== params.passwd){
                return self.errorInfo = "两次密码不一致";
            }
            yd.ajax({
                "url": "../apiprovince/v1/account/update",
                "type": "POST",
                "dataType": "json",
                "data": params,
                success (data) {
                    if (data.success) {
                        self.$Message.success("修改成功！");
                        self.changePassword = false;
                        self.logout();
                    } else {
                        self.$Message.error(data.msg);
                    }
                },
                error () {
                    self.$Message.error("修改失败！");
                }
            });
        }
    }
};
</script>