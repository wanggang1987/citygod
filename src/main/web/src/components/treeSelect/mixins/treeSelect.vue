<template>
<Dropdown 
    class="treeSelect" 
    transfer-class-name="treeSelectWrap" 
    transfer 
    trigger="custom" 
    :visible="visible && !disabled" 
    @on-clickoutside="handleClose" 
    @click.native="visibleShow"
    :class="{'tree-select-disabled': disabled}"
    ref="drop">
    <div class="br titlebar">
        <span v-show="!title" style="color:#aaa">请选择{{ placeholder }}</span>
        <div class="simulationBtn dib pr" v-show="title">
            <span class="whitespace db">{{ title }}</span>
            <Icon class="pa" type="md-close" @click="clean" />
        </div>
        <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
    </div>
    <div class="treeSelectBody" slot="list" :style="{ 'width': offsetWidth +'px'}">
        <i-input v-show="!hiddenInput" v-model.trim="key" autocomplete="off" :placeholder="`请输入${placeholder}`" type="text" ref="input" />
        <Tree class="pt8 pb8" :data="treeData" check-directly @on-check-change="checkChange" show-checkbox ref="tree"></Tree>
    </div>
</Dropdown>
<!-- </Poptip> -->
</template>

<script src="./treeSelect.js"></script>