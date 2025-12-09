<template>
    <z-action id="J_material" type="text" label="插入表格" width="1000px" :fields="fields" :beforeSubmit="submit"
        ref="action">
    </z-action>
</template>

<script>
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
                { name: 'label', label: '表格标题' },
            ],
        };
    },
    methods: {
        async submit(formData) {
            const articleId = $.getParam('article');
            const result = await $.post({
                url: "/do/put/note_content",
                data: { parentId: articleId, type: 5 },
            });
            this.editor.commands.insertContent({
                type: "sheetNode",
                attrs: { ...formData, id: result.id },
            });
        },
    },
};
</script>