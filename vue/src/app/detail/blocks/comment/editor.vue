<template>
    <div class="editor">
        <el-input v-model="text" @focus="focus" @blur="blur" autosize type="textarea" placeholder="请输入评论内容，支持粘贴截图" />
        <div class="action">
            <el-button v-show="actived" size="small" type="primary" @click="submit">提交</el-button>
            <el-image v-for="(img, idx) in images" :zoom-rate="1.2" :hide-on-click-modal="true" :initial-index="idx"
                fit="cover" :max-scale="7" :min-scale="0.2" :preview-src-list="images" :src="img" :key="idx" />
        </div>
    </div>
</template>
<script>
export default {
    props: { value: Object },
    data() {
        return { actived: false, text: null, images: [] }
    },
    methods: {
        focus() {
            this.actived = true
            document.addEventListener("paste", this.pasteImage);
        },
        blur() {
            document.removeEventListener("paste", this.pasteImage);
        },
        async pasteImage(ev) {
            let clipboardData =
                ev.clipboardData || ev.dataTransfer;
            if (!clipboardData || !clipboardData.items) {
                return;
            }
            let item = clipboardData.items[0],
                imageRe = new RegExp(/image\/.*/);
            if (!imageRe.test(item.type)) {
                return;
            }
            ev.preventDefault();
            const file = item.getAsFile();
            const result = await $.post({
                url: '/api/zen/pair',
                data: { name: file.name, public: 'public' },
                file: file
            })
            this.images.push(result.url)
        },
        async submit() {
            const { images, text } = this
            this.actived = false
            if (!text && images.length === 0) {
                return $.error("评论内容不能为空");
            }
            let param = {
                thingId: this.value.id,
                content: text,
                status: 1,
            };
            if (images.length > 0) {
                param['images'] = images
            }
            await $.post({
                data: param,
                url: "/do/put/comment",
            }, this);
            this.text = "";
            this.images = []
            this.$emit('finish')
        },
    },
}
</script>
<style lang="scss" scoped>
.editor {
    .action {
        margin-top: 8px;
        padding-bottom: 12px;
    }

    .a-image {
        margin-left: 14px;
        width: 45px;
        height: 45px;
        border: 1px solid var(--a-border-color-lighter);
        overflow: hidden;
    }

    :deep(textarea) {
        background: var(--a-fill-color-extra-light);


        &:focus {
            background: var(--a-bg-color);
        }
    }
}
</style>