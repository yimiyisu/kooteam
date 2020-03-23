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
            value() {
                if (this.type + '' !== "5") {
                    return;
                }
                this.sendData();
            }
        },
        mounted() {
            // 接受文件修改
            window.addEventListener('message', function (ev) {
                $.emit("docContentUpdate", ev.data);
            }, false);
        },
        methods: {
            sendData() {
                let iframe = this.$el.getElementsByTagName("iframe");
                iframe[0].contentWindow.postMessage(this.value, "/");
            }
        }
    }
</script>