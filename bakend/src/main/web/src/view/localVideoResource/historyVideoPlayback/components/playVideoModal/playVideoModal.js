import * as SubConfig from "@/libs/SubConfig";
import customModalBase from "_m/customModalBase";

export default {
    "name": "playVideoModal",
    "mixins": [customModalBase],
    data () {
        const self = this;
        return {
            "channelType": "",
            "channelTypes": [],
            "showVideo": true
        };
    },
    "computed": {
        videoSrc () {
            this.showVideo = true;
            let video = this.data.filter(item => item.channel == this.channelType)[0];
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port: "");
            }
            return video && video.fileName ? window.location.origin + "/" + video.fileName : "";
        }
    },
    "props": {
        "data": {
            "type": Array,
            default () {
                return [];
            }
        }
    },
    "methods": {
        init () {
            const self = this;
            self.showVideo = true;
            if ( self.data ) {
                self.channelTypes = [];
                self.data.forEach(item => {
                    if (item.flag) this.channelType = item.channel;
                    self.channelTypes.push({
                        "channel": item.channel,
                        "fileName": item.fileName
                    });
                });
                if (self.$refs.video) self.$refs.video.currentTime = 0;
            }
        },
        render (channel) {
            return SubConfig.videoChannel[channel];
        },
        videoError () {
            const self = this;
            self.showVideo = !self.showVideo;
        }
    }
};