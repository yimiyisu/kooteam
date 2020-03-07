<template>
    <div class="k-graph">
        <iframe @load="sendData" src="/doc/flow.html"></iframe>
    </div>
</template>
<script>
    export default {
        name: "graph",
        props: ["value", "type"],
        watch: {
            value: function () {
                if (this.type + '' !== "5") {
                    return;
                }
                this.sendData();
            }
        },
        mounted: function () {
            let that = this;
            // 接受文件修改
            window.addEventListener('message', function (ev) {
                that.$parent.updateContent(ev.data);
            }, false);
        },
        methods: {
            sendData: function () {
                let iframe = this.$el.getElementsByTagName("iframe");
                iframe[0].contentWindow.postMessage(this.value, "/");
            }
        }
    }
</script>