<template>
    <div>钉钉登录</div>
</template>
<script>
    export default {
        mounted: function () {
            dd.ready(function () {
                dd.runtime.permission.requestAuthCode({
                    corpId: "ding757b036387e60579",//需要换成变量
                    onSuccess: function (result) {
                        debugger;
                    },
                    onFail: function (err) {
                        debugger
                    }
                });
            });
        }
    }
</script>