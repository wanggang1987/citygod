<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="600" :mask-closable="false">
    <div slot="header" class="pr header">{{ id ? "编辑" : "新增" }}<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <Form class="mainBody" ref="form" :model="$data" :label-width="124" :rules="rules" style="padding: 8px 24px;">
        <div class="clearfix ivu-row">
            <FormItem prop="carLicense" class="mt16">
                <span slot="label">车牌号：</span>
                <i-input v-model.trim="carLicense" :disabled="id"  placeholder="请输入车牌号" style="width: 340px;" />
            </FormItem>
            <FormItem prop="plateColor">
                <span slot="label">车牌颜色：</span>
                <i-select v-model="plateColor" :disabled="id" transfer style="width: 340px;">
                    <i-option v-for="item in plateColorList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </FormItem>
            <FormItem prop="companyId" :rules="companyRule">
                <span slot="label">企业名称：</span>
                <enterprise-auto-complete v-model.trim="companyName" @on-change="changeEnterprise" style="width: 340px;"></enterprise-auto-complete>
            </FormItem>
            <FormItem prop="simCardNo">
                <span slot="label">SIM卡号：</span>
                <i-input v-model.trim="simCardNo" maxlength="20" placeholder="请输入SIM卡号" style="width: 340px;" />
            </FormItem>
            <FormItem prop="channel">
                <span slot="label">通道号：</span>
                <CheckboxGroup v-model="channel">
                    <Checkbox :label="item.value" v-for="item in channelList" :key="item.value">{{ item.label }}</Checkbox>
                </CheckboxGroup>
            </FormItem>
        </div>
    </Form>

    <div slot="footer" class="footer">
        <i-button @click="cancel">取消</i-button>
        <i-button type="primary" :loading="loading" @click="ok">保存</i-button>
    </div>
</Modal>
</template>

<script src="./editModal.js"></script>