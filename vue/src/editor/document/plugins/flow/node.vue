<template>
    <NodeViewWrapper :class="'c-node ' + attrs.type">
        <div :class="{
            'image-view__body--focused': selected && editor?.isEditable && !isFull,
            'image-view__body': editor?.isEditable && !isFull
        }" style="height: 100%; width: 100%;">
            <div class="node-title" style="position: relative; z-index: 10;">
                <span style="margin-right: 6px;">
                    {{ attrs.label }}
                </span>
                <template v-if="!isFull">
                    <IPenLine v-if="selected && editor?.isEditable" @click.stop="edit" tooltip="编辑" class="hover" />
                    <IPresentation v-if="selected && editor?.isEditable" @click.stop="preview" tooltip="全屏预览" class="hover" />
                </template>
                <IArrowLeftFromLine v-if="isFull" @click.stop="exit" tooltip="退出" class="hover" />
            </div>
            <z-block url="/do/get/note_content" :params="attrs">
                <template #default="result">
                    <Other :readonly="readonly" :noteId="attrs.id" :content="result.content" :type="4" />
                </template>
            </z-block>
            <div v-if="editor?.isEditable && !selected && !isFull" class="image-view__body__placeholder" @click="selectNode" style="z-index: 1; pointer-events: auto; top: 0;"></div>
            <div v-if="editor?.isEditable && !isFull" v-show="selected" class="image-resizer drag-handle" style="pointer-events: none;"></div>
        </div>
    </NodeViewWrapper>
</template>

<script>
import Other from '@/editor/document/other.vue';
import IArrowLeftFromLine from '@icons/arrow-left-from-line';
import IPenLine from '@icons/pen-line';
import IPresentation from '@icons/presentation';
import { useZIndex } from 'element-plus';
import { defineComponent, ref, toRef, toRefs, computed } from 'vue';

const defWidth = '800px'
const defHeight = '450px'

export default defineComponent({
    components: {
        IPenLine,
        IPresentation,
        IArrowLeftFromLine,
        Other
    },
    props: Object,
    setup(props) {
        const readonly = ref(true)
        const isFull = ref(false)
        const width = ref(defWidth)
        const height = ref(defHeight)
        const selected = toRef(props, 'selected')
        const { getPos, node, editor } = toRefs(props)
        const attrs = computed(() => node.value.attrs)
        return {
            attrs,
            readonly,
            isFull,
            width,
            height,
            editor,
            selected,
            getPos,
        }
    },

    methods: {
        selectNode() {
            if (this.editor?.isEditable) {
                this.editor?.commands.setNodeSelection(this.getPos());
            }
        },

        exit() {
            this.readonly = true
            this.isFull = false
            this.width = defWidth
            this.height = defHeight
            $.fullscreen(this.$el)
            // 退出后恢复选中状态
            this.$nextTick(() => {
                if (this.editor?.isEditable) {
                    this.editor.commands.setNodeSelection(this.getPos())
                }
            })
        },

        edit() {
            console.log('edit')
            // 取消选中状态
            if (this.editor?.isEditable) {
                this.editor.commands.blur()
            }
            const dom = this.$el
            this.readonly = false
            this.isFull = true
            let nextIndex = useZIndex().nextZIndex()
            this.width = '100%'
            this.height = '100%'
            $.fullscreen(dom, nextIndex)
        },

        preview() {
            if (this.editor?.isEditable) {
                this.editor.commands.blur()
            }
            const dom = this.$el
            this.isFull = true
            let nextIndex = useZIndex().nextZIndex()
            this.width = '100%'
            this.height = '100%'
            $.fullscreen(dom, nextIndex)
        }
    },
})
</script>

<style lang="scss" scoped>
.z-i {
    margin-left: 8px;
}
</style>