<template>
    <div class="k-login">
        <h3>欢迎使用Kooteam</h3>
        <div v-if="welcome">
            <div>请用电脑登陆：{{host}}</div>
        </div>
        <div v-else>
            <div v-if="status">恭喜你，电脑端已登陆成功</div>
            <div v-else>正在登陆中，请稍后</div>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                status: false,
                welcome: true,
                host: null
            }
        },
        mounted: function () {
            let checkId = $.getParam("checkId"),
                corpId = $.getParam("corpId"),
                that = this;
            if (checkId) {
                this.welcome = false;
            }
            this.host = window.location.origin;
            dd.ready(function () {
                dd.runtime.permission.requestAuthCode({
                    corpId: corpId,
                    onSuccess: function (result) {
                        let params = {
                            checkId: checkId,
                            code: result.code
                        };
                        if (!params.code) {
                            return alert("用户信息错误");
                        }
                        $.post(params, "/home/dingWap.do", function (res) {
                            this.status = true;
                        }, that);
                    },
                    onFail: function (err) {
                        alert(JSON.stringify(err));
                    },
                    onFinish: function (dd) {
                        alert(JSON.stringify(dd));
                    }
                });
            });
        }
    }
</script>