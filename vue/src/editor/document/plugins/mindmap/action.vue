<template>
    <z-action type="text" label="插入思维脑图" width="1000px" :fields="fields" :beforeSubmit="submit">
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
                { name: 'label', label: '脑图标题' },
            ],
        };
    },
    methods: {
        async submit(formData) {
            const articleId = $.getParam('article');
            const result = await $.post({
                url: "/do/put/note_content",
                data: { parentId: articleId, type: 3 },
            });
            this.editor.commands.insertContent({
                type: "mindNode",
                attrs: { ...formData, id: result.id },
            });
        },
    },
};
</script>