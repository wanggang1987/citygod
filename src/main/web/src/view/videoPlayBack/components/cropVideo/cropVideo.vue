<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="520" :mask-closable="false">
    <div slot="header" class="pr header">视频下载<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <Form class="mainBody" ref="form" :model="$data" :label-width="88" style="padding: 8px 24px;">
        <div class="clearfix ivu-row">
            <FormItem class="mt16">
                <span slot="label">码流选择：</span>
                <radio-group v-model="steam">
                    <radio :label="item.value" v-for="item in steamList" :key="item.value">{{ item.label }}</radio>
                </radio-group>
            </FormItem>
            <FormItem>
                <span slot="label">开始时间：</span>
                <TimePicker type="time" v-model="startTime" style="width:200px" :editable="false" :clearable="false" transfer @on-change="change"></TimePicker>
            </FormItem>
            <FormItem :error="error.endTime">
                <span slot="label">结束时间：</span>
                <TimePicker type="time" v-model="endTime" style="width:200px" :editable="false" :clearable="false" transfer @on-change="change"></TimePicker>
            </FormItem>
            <FormItem :error="error.channel">
                <span slot="label">通道号：</span>
                <CheckboxGroup v-model="channel" style="width: calc(100% - 90px);">
                    <Checkbox :label="item.value" v-for="item in channelList" :key="item.value">{{ item.label }}</Checkbox>
                </CheckboxGroup>
            </FormItem>

            <div class="mb16" style="color: #E50012;">当前下载有{{ list.length }}段视频</div>
        </div>
    </Form>
    <div slot="footer" class="footer">
        <i-button @click="cancel">取消</i-button>
        <i-button type="primary" :loading="loading" @click="ok">保存</i-button>
    </div>
</Modal>
</template>

<script src="./cropVideo.js"></script>