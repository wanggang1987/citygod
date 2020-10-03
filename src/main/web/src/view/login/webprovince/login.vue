<template>
    <div class="loginBg">
        <div class="loginTitle-haiguan"></div>
        <div class="loginBoard">
            <div class="loginPanel">
                <div class="loginPanelTitle">
                    欢迎登录
                </div>
                <div class="loginContent">
                    <div class="input-group">
                    <span class="icon-user">
                    </span>
                        <i-input type="text" v-model="user" placeholder="请输入用户名" @on-enter="login"
                                 style="color:rgba(204,204,204,1);">
                        </i-input>
                        <div class="ma" style="color:#F35858; width:100%;text-align:left;" v-show="userInfo.length">
                            <i class="fs16 ivu-icon ivu-icon-ios-alert" style="vertical-align: text-bottom;">
                            </i>
                            {{userInfo}}
                        </div>
                    </div>
                    <div class="input-group">
                    <span class="icon-password">
                    </span>
                        <i-input type="password" v-model="password" placeholder="请输入密码" @on-enter="login">
                        </i-input>
                        <div class="ma" style="color:#F35858; width:100%;text-align:left;" v-show="pwInfo.length">
                            <i class="fs16 ivu-icon ivu-icon-ios-alert" style="vertical-align: text-bottom;">
                            </i>
                            {{pwInfo}}
                        </div>
                    </div>
                    <i-button class="loginBtn" type="primary" @click="login">
                        登录
                    </i-button>
                </div>
            </div>
        </div>
        <div class="copyright">
            版权所有©中华人民共和国南京海关2020
        </div>
        <browser-match></browser-match>
    </div>
</template>

<script src="./login.js"></script>