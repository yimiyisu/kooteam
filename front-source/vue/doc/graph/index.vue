<template>
    <div class="k-graph">
        <iframe id="J_graphIframe" src="/doc/flow.html"></iframe>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        watch: {
            value: function () {
                this.changeData();
            }
        },
        mounted: function () {
            let that = this;
            window.addEventListener('message', function (ev) {
                let data = ev.data;
                if (data.type === "graphLoad") {
                    that.changeData();
                }
                if (data.type === "xmlsave") {
                    that.$parent.tip("保存完成");
                }
            }, false);
        },
        methods: {
            changeData: function () {
                let iframe = document.getElementById("J_graphIframe");
                let val = this.value;
                let params = {
                    type: "load",
                    content: val.content,
                    id: val._id
                };
                iframe.contentWindow.postMessage(params, "/");
            }
        }
    }
</script>