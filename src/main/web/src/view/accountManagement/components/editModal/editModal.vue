<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="600" :mask-closable="false">
    <div slot="header" class="pr header">{{ id ? "编辑" : "新增" }}<i @click="close" class="pa close iconfont icon_jt_close"></i></div>
    <Form class="mainBody" ref="form" :model="$data" :label-width="88" :rules="rules" style="padding: 8px 24px;">
        <div class="clearfix ivu-row">
            <FormItem prop="name" class="mt16">
                <span slot="label">账号：</span>
                <i-input v-model.trim="name" placeholder="请输入账号" style="width: 340px;" />
            </FormItem>
            <FormItem prop="passwd" v-if="!id">
                <span slot="label">密码：</span>
                <i-input v-model.trim="passwd" placeholder="请输入密码" style="width: 340px;" />
            </FormItem>
            <FormItem>
                <span slot="label">菜单权限：</span>
                <div class="fl" style="line-height: 1.5;width: calc(100% - 70px);overflow: auto;">
                    <Tree :data="treeData" show-checkbox @on-check-change="checkChange"></Tree>
                </div>
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