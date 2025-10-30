<template>
    <z-editor :modelValue="content" output="html" :plugins="plugins" @change="save" />
</template>

<script>
import BlockNode from './blocks/blockNode/baseBlock'; // 统一的块级节点
export default {
    props: {
        content: String,
        noteId: String,
        type: Number,
    },
    setup() {
        return {
            plugins: [BlockNode], // 只使用一个块级节点插件
        };
    },
    methods: {
        change(content) {
            debugger
            $.post({
                url: "/do/patch/note_content", data: { id: this.noteId, content }
            })
        },
    },
}
</script>
