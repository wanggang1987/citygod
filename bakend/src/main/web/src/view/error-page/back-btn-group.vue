<template>
    <div>
        <Button size="large" type="text" @click="backHome">返回首页</Button>
        <Button size="large" type="text" @click="backPrev">返回登录页({{ second }}s)</Button>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import "./error.less";
export default {
    "name": "backBtnGroup",
    data () {
        return {
            "second": 5,
            "timer": null
        };
    },
    "methods": {
        ...mapActions([
            "handleLogOut"
        ]),
        backHome () {
            this.$router.replace({
                "name": this.$config.homeName
            });
        },
        backPrev () {
            // this.$router.go(-1);
            this.handleLogOut().then(() => {
                this.$router.push({
                    "name": "login"
                });
            });
        }
    },
    mounted () {
        this.timer = setInterval(() => {
            if (this.second === 0) this.backPrev();
            else this.second--;
        }, 1000);
    },
    beforeDestroy () {
        clearInterval(this.timer);
    }
};
</script>
