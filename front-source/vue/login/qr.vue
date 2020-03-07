<template>
    <div id="J_qr" class="qr"></div>
</template>
<script>
    export default {
        props: ["value"],
        mounted: function () {
            let params = this.value, host = window.location.origin;
            // 企业微信登录二维码
            if (params.type === "wechat") {
                return $.js(['http://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js'], () => {
                    window.WwLogin({
                        "id": "J_qr",
                        "appid": params.appid,
                        "agentid": params.agentid,
                        "redirect_uri": host + params.redirect_uri,
                        "state": params.checkId
                    });
                });
            }
            // 云版本个人微信扫码登录
            if (params.type === "cloud") {
                let now = new Date();
                now = $.date(parseInt(now.getTime() / 1000) + 900);
                return this.$el.innerHTML = `<img src="${params.qr}"/><br />二维码${now}前有效`;
            }
            // 钉钉扫码登录，自助生成二维码
            $.lib(["qrcode.min.js"], () => {
                let qr = host + params.url;
                let qrcode = new QRCode(this.$el, {
                    width: 150,
                    height: 150
                });
                qrcode.makeCode(qr);
            });
        }
    }
</script>