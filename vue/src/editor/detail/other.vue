<template>
    <iframe ref="iframe" style="border:0;height:calc(100vh - 120px);width:100%" :srcdoc="doc"> </iframe>
</template>
<script>
import iframe from '../document/blocks/iframeTemplate';
export default {
    props: {
        data: Object,
        type: Number
    },
    data() {
        return { doc: null }
    },
    mounted() {
        const { data } = this
        this.doc = iframe(data.type, '', true)
        window.addEventListener('message', this.listen, false);
        // 增加只读数据传递
    },
    unmounted() {
        window.removeEventListener('message', this.listen)
    },
    methods: {
        listen({ data }) {
            if (!data || data.type !== 'iframeLoaded') {
                return
            }
            const { contentWindow } = this.$refs['iframe']
            contentWindow.postMessage({ type: 'initContent', content: this.data.content })
        }
    },
}
</script>