<template>
    <div @click="login">
        <div v-show="isDD&&timer" style="width: 150px;margin: 20px auto">
            <input v-if="checkId" type="hidden" id="J_qrId" :value="checkId"/>
            <div class="qr"></div>
        </div>
        <div class="z-link">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["timer", "showTip", "type"],// timer是秒数
        data: function () {
            return {
                timerId: null,
                isDD: false,
                checkId: null,
                isShow: false
            }
        },
        mounted: function () {
            if (this.type) {
                this.isDD = true;
                if (this.timer) {
                    $.http(null, "/ding/qr.do", function (reback) {
                        let dom = $(".qr", this.$el), data = reback.data;
                        let qr = data.host + "/ding/home.wap?checkId=" + data.checkId;
                        let qrcode = new QRCode(dom[0], {
                            width: 150,
                            height: 150
                        });
                        qrcode.makeCode(qr);
                        this.checkId = data.checkId;
                    }, this);
                }
            }
            if (this.timer) {
                let that = this;
                this.timerId = setInterval(function () {
                    that.login();
                }, this.timer * 1000);
            } else {
                this.login();
            }
        },
        destroyed: function () {
            clearInterval(this.timerId);
        },
        methods: {
            login: function () {
                let qrId = $("#J_qrId").val(), url;
                if (this.isDD) {
                    url = "/ding/checkLogin.do"
                } else {
                    let domain = "//bridge.kooteam.com";
                    if (zen.env === "daily") {
                        domain = "//bridge.dev.zeto.me";
                    }
                    url = domain + "/weixin/checkLogin.do";
                }
                $.http({id: qrId}, url, function (reback) {
                    if (reback.hasError) {
                        return;
                    }
                    if (this.timerId) {
                        clearInterval(this.timerId);
                        this.timerId = null;
                    }
                    let config = window.localStorage["config"], homeURL = "/todo/home.htm";
                    if (config && config.home) {
                        config = JSON.parse(config);
                        homeURL = config.home;
                    }
                    window.location = homeURL;
                }, this);
            }
        }

    }
</script>