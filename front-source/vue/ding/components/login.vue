<template>
    <div>钉钉登录</div>
</template>
<script>
    export default {
        mounted: function () {
            dd.ready(function () {
                let corpId = $.getParam("corpId"), checkId = $.getParam("checkId");
                dd.runtime.permission.requestAuthCode({
                    corpId: corpId,//需要换成变量
                    onSuccess: (result) => {
                        $.get({checkId: checkId, code: result.code}, "/home/dingWap.do", () => {
                            this.$el.innerText = "登录成功";
                        });
                    },
                    onFail: (err) => {
                        alert(JSON.stringify(err));
                    }
                });
            });
        }
    }
</script>