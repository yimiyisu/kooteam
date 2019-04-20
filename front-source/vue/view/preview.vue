<template>
    <div v-if="isShow" class="preview" @click="hide">
        <img id="J_previewImg" draggable="true" :src="src"/>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                src: "//a.yimiyisu.com/s.gif",
                isShow: false
            }
        },
        mounted: function () {
            $.on("imgPreview", function (img) {
                this.src = img;
                this.isShow = true;
            });
        },
        methods: {
            hide: function () {
                this.showImg = false;
            }
        }
    }
</script>