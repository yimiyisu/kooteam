<template>
    <div>
        <div v-if="value.qr==='dd'">请用钉钉扫码二维码</div>
        <div v-if="value.qr==='wechat'">请用企业微信扫码二维码</div>
        <div class="qr"></div>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        mounted: function () {
            // 这里要区分微信二维码和钉钉二维码
            let dom = $(".qr", this.$el).el, data = this.value;
            let qr = data.host + "?checkId=" + data.checkId;
            let qrcode = new QRCode(dom[0], {
                width: 150,
                height: 150
            });
            qrcode.makeCode(qr);
        }
    }
</script>