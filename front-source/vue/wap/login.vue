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
                url: "/login/dingWap.do",
                host: null
            }
        },
        mounted: function () {
            let checkId = $.getParam("checkId");
            if (checkId) {
                this.welcome = false;
            }
            this.host = window.location.origin;
            $.http({checkId: checkId}, this.url, function (res) {
                let data = res.data;
                if (data && data.initing) {
                    return this.getUserByCode(checkId, data.corpId)
                }
                this.status = true;
            }, this);
        },
        methods: {
            getUserByCode: function (checkId, corpId) {
                let that = this;
                dd.ready(function () {
                    // requestOperateAuthCode  requestAuthCode
                    dd.runtime.permission.requestAuthCode({
                        corpId: corpId,
                        onSuccess: function (result) {
                            let params = {
                                checkId: checkId,
                                authCode: result.code
                            };
                            if (!params.authCode) {
                                return alert("用户信息错误");
                            }
                            $.http(params, that.url, function (res) {
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
    }
</script>