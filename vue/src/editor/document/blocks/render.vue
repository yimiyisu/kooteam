<template>
    <div :class="['container', { full: isFulled }]">
        <div class="tool">
            <z-icon :value="isFulled ? 'minimize' : 'maximize'" @click="fullscreen" class="hover" />
            <!-- <z-icon value="edit" @click="fullscreen" class="hover" /> -->
            <br />
            <el-popconfirm v-if="inEditor && !isFulled" title="确定删除吗？" placement="right-start" @confirm="remove">
                <template #reference>
                    <z-icon value="trash2" class="hover" />
                </template>
            </el-popconfirm>
        </div>
        <iframe @dblclick="dbl" ref="iframe" v-if="doc" style="border:0;height:100%;width:100%" :srcdoc="doc"></iframe>
    </div>
</template>
<script>
import IframeTemplate from './iframeTemplate';

export default {
    props: {
        value: String,
        inEditor: {
            type: Boolean,
            default: false
        },
        type: String
    },
    data() {
        return { doc: null, data: null, isFulled: false }
    },
    async mounted() {
        const { value, type } = this;
        this.doc = IframeTemplate(type, value, !this.inEditor)
        // const result = await $.get({ url: '/do/get/note_content', data: { noteId, blockId: value } })
        // this.data = result;
    },
    methods: {
        remove() {
            this.$emit("remove")
        },
        dbl() {
            if (this.isFulled) {
                return
            }
            this.fullscreen()
        },
        fullscreen() {
            // let element = this.$refs['iframe']
            $.fullscreen(this.$el, this.isFulled)
            this.isFulled = !this.isFulled
        }
    },
}
</script>