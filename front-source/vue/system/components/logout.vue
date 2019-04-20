<template>
    <div>正在退出，请稍等...</div>
</template>
<script>
    export default {
        mounted: function () {
            let domain = "//bridge.kooteam.com";
            if (zen.env === "daily") {
                domain = "//bridge.dev.zeto.me";
            }
            let url = domain + "/home/logout.do";
            if (zen.mode > 2) {
                url = "/home/quit.do";
            }
            $.http(null, url, function () {
                window.localStorage.removeItem("config");
                document.cookie = "";
                window.location = "/home.html";
            });
        }
    }
</script>