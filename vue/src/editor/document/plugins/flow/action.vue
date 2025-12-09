<template>
    <z-action type="text" label="插入流程图" :fields="fields" :beforeSubmit="submit">
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
                { name: 'label', label: '流程图标题' },
            ],
        };
    },
    methods: {
        async submit(formData) {
            const articleId = $.getParam('article');
            const result = await $.post({
                url: "/do/put/note_content",
                data: { parentId: articleId, type: 4 },
            });
            this.editor.commands.insertContent({
                type: "flowNode",
                attrs: { ...formData, id: result.id },
            });
        },
    },
};
</script>