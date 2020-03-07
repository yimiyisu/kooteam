<template>
    <div style="text-align: center">
        <img style="width: 260px" :src="qr"/>
        <br/>
        二维码{{date}}前内有效
    </div>
</template>
<script>
    export default {
        data() {
            return {
                qr: ""
            }
        },
        computed: {
            date() {
                let now = new Date();
                now = parseInt(now.getTime() / 1000) + 900;
                return $.date(now);
            }
        },
        mounted() {
            let user = $.getUser();
            $.get({id: "join" + user.siteId}, "/home/kooteamJoin.do", function (reback) {
                this.qr = reback.data;
            }, this);
        }
    }
</script>