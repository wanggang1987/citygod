<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="596" :mask-closable="false">
    <div slot="header" class="pr header">导入<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <div class="mainBody importFiles" style="padding: 24px 80px 52px;">
        <div class="clearfix">
            <Upload
                :class="disabled ? 'upload-disabled' : ''"
                type="drag"
                :action="action"
                :before-upload="beforeUpload"
                ref="upload"
                :disabled="disabled"
                :show-upload-list="false"
                >
                <div class="upload-drag">
                    <Icon custom="iconfont icon_shangchuan" size="36"></Icon>
                    <p class="fs14">点击或将文件拖拽到这里上传</p>
                </div>
            </Upload>
            <ul class="ivu-upload-list" style="line-height: 1.5;">
                <li class="ivu-upload-list-file" v-for="(item, index) in fileList" :key="index">
                    <span>
                        <i class="ivu-icon ivu-icon-md-document"></i>{{ item.name }}
                    </span>
                    <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" @click="clean"></i> 
                </li>
            </ul>
            <div class="pt28">
                <span class="mr8 fs14" style="color: #777;">
                    <Icon type="ios-alert" size="16" style="color: #999;"></Icon>
                    说明：导入文件类型为EXCEL格式，您可以先点击</span>
                <i-button @click="down" type="primary" ghost>下载模板</i-button>
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

export default {
    "name": "importModal",
    "mixins": [customModalBase],
    "props": {
        "action": {
            "type": String,
            "default": ""
        },
        "templateUrl": {
            "type": String,
            "default": ""
        }
    },
    data () {
        return {
            "fileList": []
        };
    },
    "computed": {
        disabled () {
            return !!this.fileList.length;
        }
    },
    "methods": {
        init () {
            this.fileList = [];
        },
        down () {
            window.open(this.templateUrl);
        },
        beforeUpload (file) {
            this.fileList = [file];
            return false;
        },
        clean () {
            this.fileList = [];
        },
        ok () {
            const self = this;
            const file = self.fileList[0];
            if (!file) return self.$Message.error("请选择需要导入的文件！");
            const formData = new FormData();
            formData.append("file", file);
            yd.request({
                "url": this.action,
                "method": "post",
                "headers": {
                    "Content-Type": "multipart/form-data"
                },
                "data": formData
            }).then(res => {
                const json = res.data;
                if (json.success) {
                    self.$Message.success("导入成功!");
                    self.modal = false;
                    self.$emit("on-success");
                } else {
                    self.$Message.error(json.msg || "导入失败!");
                    self.$emit("on-error");
                }
            }).catch(err => {
                self.$Message.error("导入失败!");
                self.$emit("on-error");
            });
        }
    }
};
</script>