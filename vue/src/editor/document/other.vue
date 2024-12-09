<template>
    <iframe ref="iframe" style="border:0;height:100%;width:100%" :srcdoc="doc"> </iframe>
</template>
<script>
import iframe from './blocks/iframeTemplate';
export default {
    props: {
        noteId: String,
        content: String,
        type: Number
    },
    data() {
        return { doc: null }
    },
    mounted() {
        this.doc = iframe(this.type, this.noteId)
        window.addEventListener('message', this.listen)
    },
    unmounted() {
        window.removeEventListener('message', this.listen)
    },
    methods: {
        listen({ data }) {
            if (!data) {
                return
            }
            const { contentWindow } = this.$refs['iframe']
            if (data.type === 'iframeLoaded') {
                return contentWindow.postMessage({ type: 'initContent', content: this.content })
            }
            if (data.type === 'saveContent') {
                return $.post({ url: "/do/patch/note_content", data: { content: data.content, id: this.noteId } })
            }
        }
    },
}
</script>