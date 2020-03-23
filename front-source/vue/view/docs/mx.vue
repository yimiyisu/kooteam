<template>
    <div class="k-graph">
        <iframe @load="sendData" src="/doc/mxview.html"></iframe>
    </div>
</template>
<script>
    export default {
        name: "docGraph",
        props: ["value", "type"],
        watch: {
            value(val) {
                if (val.type !== 5) {
                    return;
                }
                this.sendData();
            }
        },
        methods: {
            sendData() {
                let iframe = this.$el.getElementsByTagName("iframe");
                iframe[0].contentWindow.postMessage(this.value.content, "/");
            }
        }
    }
</script>