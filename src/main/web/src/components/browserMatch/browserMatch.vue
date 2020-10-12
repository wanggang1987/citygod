<template>
  <Modal
    width="470px"
    v-model="modal"
    class="browserMatch"
    footer-hide
    :mask-closable="false"
    :closable="false"
  >
    <div class="tac" style="height: 206px;padding-top: 27px;">
      <p class="ffm fs14" style="color: #333;">亲爱的用户，您当前使用的浏览器不兼容，可能存在安全风险！</p>
      <p class="ffm fs14" style="color: #333;margin-top: 15px;">请您下载以下浏览器：</p>
      <div class="tac ivu-row" style="margin-top: 32px;">
        <div class="ivu-col ivu-col-span-8">
          <div>
            <img src="../../assets/images/360_logo.png" />
          </div>
          <Button
            style="background-color: #108EE8; border: 1px solid #108EE8; margin-top: 12px;width: 120px;padding: 0px;"
            type="primary"
            @click="downloadBrowser(0)"
          >下载360浏览器</Button>
        </div>
        <div class="ivu-col ivu-col-span-8">
          <div>
            <img src="../../assets/images/google_logo.png" />
          </div>
          <Button
            style="background-color: #108EE8; border: 1px solid #108EE8; margin-top: 12px;width: 120px;padding: 0px;"
            type="primary"
            @click="downloadBrowser(1)"
          >下载谷歌浏览器</Button>
        </div>
        <div class="ivu-col ivu-col-span-8">
          <div>
            <img src="../../assets/images/fireFox_logo.png" />
          </div>
          <Button
            style="background-color: #108EE8; border: 1px solid #108EE8; margin-top: 12px;width: 120px;padding: 0px;"
            type="primary"
            @click="downloadBrowser(2)"
          >下载火狐浏览器</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
    "name": "browserMatch",
    "props": {
        "value": {
            "type": Boolean,
            "default": false
        }
    },
    data () {
        return {
            "modal": false //modal
        };
    },
    mounted () {
        const self = this;
        self.isIE();
        if (self.isIE().chrome && self.isIE().chrome >= 63) {
            self.modal = false;
        } else if (self.isIE().firefox && self.isIE().firefox >= 66) {
            self.modal = false;
        } else if (self.isIE().ie && self.isIE().ie >= 11) {
            self.modal = false;
        } else {
            self.modal = true;
        }
    },
    "methods": {
        "cancel": function() {
            this.browser = false;
        },

        "isIE": function() {
            let ua = navigator.userAgent;
            let ret = {},
                webkit = ua.match(/WebKit\/([\d.]+)/),
                chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
                ie =
          ua.match(/MSIE\s([\d.]+)/) ||
          ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                safari = ua.match(/Safari\/([\d.]+)/),
                opera = ua.match(/OPR\/([\d.]+)/);
            webkit && (ret.webkit = parseFloat(webkit[1]));
            chrome && (ret.chrome = parseFloat(chrome[1]));
            ie && (ret.ie = parseFloat(ie[1]));
            firefox && (ret.firefox = parseFloat(firefox[1]));
            safari && (ret.safari = parseFloat(safari[1]));
            opera && (ret.opera = parseFloat(opera[1]));
            return ret;
        },

        "downloadBrowser": function(type) {
            const self = this;
            console.log(type);
            if (type == 0) {
                window.open("https://browser.360.cn/ee/");
            } else if (type == 1) {
                window.open("https://www.google.cn/chrome/");
            } else {
                window.open("https://www.firefox.com.cn/");
            }
        }
    }
};
</script>