<template>
    <div v-if="isShow" class="preview" @click="hide">
        <img id="J_previewImg" draggable="true" :src="src"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                src: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
                isShow: false
            }
        },
        mounted() {
            $.on("imgPreview", function (img) {
                this.src = img;
                this.isShow = true;
            });
        },
        methods: {
            hide() {
                this.isShow = false;
            }
        }
    }
</script>