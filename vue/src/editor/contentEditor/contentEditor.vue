<template>
    <z-block url="/do/get/note_content" :params="params">
        <template #default="data">
            <z-form v-if="data" url="/do/patch/note_content" :fields="['content']" :data="data"
                :beforeSubmit="beforeSubmit" :closable="false">
                <template #content="formData">
                    {{ formData.content }}
                    <z-tiptap v-model="formData.content" style="margin-bottom: 20px" height="720px"
                        :plugins="plugins" @update:modelValue="update" ref="editor" />
                </template>
            </z-form>
        </template>
    </z-block>
</template>

<script>
import BlockNode from './blocks/blockNode/baseBlock'; // 统一的块级节点
export default {
    props: {
        content: String,
        noteId: String,
        type: Number,
    },
    data() {
        return {
            params: {
                id: this.noteId,
            },
            editor: null,
            plugins: [BlockNode], // 只使用一个块级节点插件
            fields: [],
        };
    },
    methods: {
        update(value, editor) {
            console.log(value)
            this.editor = editor
        },
        beforeSubmit(formData) {
            if (!this.editor) {
                return { id: formData.id,content: formData.content }
            }
            const content = this.editor.getHTML()
            return {id: formData.id, content: content }
        },
    },
}
</script>
