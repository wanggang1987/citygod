<template>
    <div class="avatar">
        <div class="userAvatar">
            <!-- <Avatar icon="ios-person" size="small" /> -->
            <svg class="vam" aria-hidden="true" style="width:28px;height:24px;">
                <use xlink:href="#icon_touxiang"></use>
            </svg>
            <dropdown :transfer="true" @on-click="changePassword">
                <span class="personName">欢迎你，{{userName}}</span>
                <dropdown-menu slot="list">
                    <dropdown-item>修改密码</dropdown-item>
                </dropdown-menu>
            </dropdown>
        </div>
        <Tooltip class="logout vab mr20" transfer content="下载中心">
            <Icon :size="22" custom="iconfont icon_xiazaizhongxin" @click="downTable" />
        </Tooltip>
        <Tooltip class="logout vab" transfer content="退出">
            <i class="iconfont icon_tuichu" @click="logout"></i>
        </Tooltip>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    "name": "User",
    "computed": {
        userName () {
            return this.$store.state.user.userName;
        }
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
        changePassword () {
            this.$emit("change-password");
        },
        downTable () {
            this.$router.push({
                "name": "downExport"
            });
        }

    }
};
</script>
