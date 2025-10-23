<!-- blocks/blockInsert.vue -->
<template>
    <z-action id="J_block_insert" type="text" label="插入编辑器块" :fields="fields" :beforeSubmit="submit" ref="action">
    </z-action>
</template>

<script>
const blockTypes = [
    { value: 'mindmap', label: '思维导图' },
    { value: 'flow', label: '流程图' },
    { value: 'spreadsheet', label: '电子表格' },
    { value: 'excalidraw', label: '绘图' },
]

export default {
    props: {
        editor: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            fields: [
                {
                    name: 'type',
                    label: '编辑器类型',
                    type: 'select',
                    options: blockTypes
                },
            ],
        }
    },

    methods: {
        submit(formData) {
            const nodeName = 'blockNode';
            const blockType = formData.type;
            const typeValue = this.getTypeValue(blockType);

            this.editor.commands.insertContent({
                type: nodeName,
                attrs: {
                    noteId: this.getNoteId(),
                    content: '',
                    type: typeValue,
                    blockType: blockType
                }
            });
        },

        getNoteId() {
            return this.editor.options.editorProps.attributes?.noteId || '';
        },

        getTypeValue(blockType) {
            const typeMap = {
                'mindmap': 3,
                'flow': 4,
                'spreadsheet': 5,
                'excalidraw': 6
            };
            return typeMap[blockType] || 3;
        }
    },
}
</script>