<template>
<Modal class="customModal" v-model="modal" :closable="false" :width="618" :mask-closable="false" footer-hide>
    <div slot="header" class="pr header">
        视频
        <i @click="close" class="pa close iconfont icon_jt_close"></i>
    </div>
    <div class="mainBody pr historyVideoModal">
         <i-select class="channel pa" v-model="channelType">
            <i-option v-for="(item, index) in channelTypes" :value="item.channel" :key="index" >{{ render(item.channel)}}</i-option>
        </i-select>
        <video class="video" v-if="showVideo" controls @error="videoError" :src="videoSrc" preload autoplay ref="video"></video>
        <div class="errorConent" v-else>
            <div class="errorMiddle">
                <p><i class="fail iconfont icon_video_fail"></i></p>
                <p>视频加载失败</p>
            </div>
        </div>
    </div>
</Modal>
</template>

<script src="./playVideoModal.js"></script>