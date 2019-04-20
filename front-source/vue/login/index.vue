<template>
    <div class="k-login" v-if="!check">
        <QR v-if="isQr" v-model="params"></QR>
        <Password v-if="!isQr" v-model="params" :target="target"></Password>
        <span class="z-red hover" v-if="isQr" @click="change">切换到账户登陆</span>
        <span class="z-red hover" v-if="!isQr&&hasQr" @click="change">切换到扫码登陆</span>
    </div>
</template>
<script>
    import Password from "./password"
    import QR from "./qr"

    export default {
        props: ["check", "timer"],
        components: {Password, QR},
        data: function () {
            return {
                isQr: false,
                hasQr: false,//是否可以扫码登陆
                params: null,
                target: "/todo/home.htm",
                timerId: null
            }
        },
        mounted: function () {
            if (this.check) {
                this.status();
            } else {
                $.http(null, "/login/type.do", function (reback) {
                    let data = reback.data;
                    this.params = data;
                    if (data && data.qr) {
                        this.isQr = true;
                        this.hasQr = true;
                        this.timerId = setInterval(this.checkId, 2000);
                    }
                }, this);
            }
        },
        destory: function () {
            clearInterval(this.timerId);
        },
        methods: {
            change: function () {
                this.isQr = !this.isQr;
            },
            checkId: function () {
                let id = this.params.checkId;
                if (!id) {
                    return;
                }
                $.http({checkId: id}, "/login/checkId.do", function (reback) {
                    if (reback.hasError) {
                        return;
                    }
                    window.location.href = this.target;
                }, this);
            },
            status: function () {
                $.http(null, "/login/checkStatus.do", function (reback) {
                    if (reback.hasError) {
                        return;
                    }
                    let home = this.target, data = reback.data;
                    if (data && data.home) {
                        home = data.home;
                    }
                    window.location = home;
                }, this);
            }
        }
    }
</script>