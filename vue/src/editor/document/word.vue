<template>
    <z-editor :modelValue="content" height="98vh" output="html" :plugins="plugins" @save="save" />
</template>

<script>
import FlowNode from './plugins/flow/index';
import MindNode from './plugins/mindmap/index';
import SheetNode from './plugins/spreadsheet/index';
import TaskNode from './plugins/task/index';
export default {
    props: {
        content: String,
        noteId: String
    },
    setup() {
        return {
            plugins: [FlowNode, MindNode, SheetNode, TaskNode], // 只使用一个块级节点插件
        };
    },
    methods: {
        save(content) {
            $.post({
                url: "/do/patch/note_content", data: { id: this.noteId, content }
            })
        },
    },
}
</script>
