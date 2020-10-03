<template>
    <div v-show="modal" class="fixScreen">

        <div class="picBox">
            <Icon type="md-close" @click="modal=false" id="picBoxCloseBtn"/>
            <div class="leftArrow" v-show="data.length>1&&index!=0" @click="backbtn">
                <Icon type="ios-arrow-back"/>
            </div>
            <div class="rightArrow" v-show="data.length>1&&index!=data.length-1" @click="prevbtn">
                <Icon type="ios-arrow-forward"/>
            </div>
            <div v-show="progressShow" class="progress">{{(index+1)+"/"+data.length}}</div>
            <div class="picgroup">
                <ul :style="{width:data.length*640+'px',transform: 'translate3d('+(0-index*640)+'px, 0px, 0px)'}"
                    style="height:100%;transition: transform 500ms ease 0s;">
                    <li v-for="item in data" :key="item"><img :src="item"/></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    "name": "picGroupFixPlayer",
    "props": {
        //初始选中值
        "value": {
            "type": Boolean,
            "default": false
        },"progressShow": {
            "type": Boolean,
            "default": true
        },
        //选项（注：选项必须包含初始选中值）
        "data": {
            "type": Array,
            "default": []
        },
        "index": {
            "type": Number,
            "default": 0
        }

    },
    data() {
        const self = this;
        return {
            "modal": false
        };
    },
    "watch": {
        "value": function (newVal, oldVal) {
            const self = this;
            self.modal = newVal;
        },
        "modal": function (newVal, oldVal) {
            const self = this;
            self.$emit("input", newVal);
        }
    },
    create() {
        this.modal = this.value;
    },
    mounted() {
        const self = this;
    },
    "methods": {
        backbtn() {
            this.index = this.index == 0 ? (this.data.length - 1) : this.index - 1;
        },
        prevbtn() {
            this.index = this.index == (this.data.length - 1) ? 0 : this.index + 1;
        }
    }
};
</script>

<style scoped>

</style>