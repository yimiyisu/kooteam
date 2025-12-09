<template>
    <div class="k-block">
        <z-editor :modelValue="content" ref="editor" :beforeInit="beforeInit" @inited="inited" @save="save" />
        <ImportFile />
    </div>
</template>
<script>
import ImportFile from './blocks/ImportFile.vue';
import Doc from './blocks/index';
import Plugin from './blocks/plugin';
export default {
    components: { ImportFile },
    props: {
        content: String,
        noteId: String
    },
    methods: {
        async load() {
            const result = await $.post({
                url: "/do/get/note_content",
                data: { id: this.noteId },
            });
            this.content = result['content']
        },
        beforeInit(config) {
            config.menubar = false
            config.height = '92vh'
            config.toolbar = 'save import ' + config.toolbar
            config.plugins += ' importcss save import'
            config.content_css = config.content_css = [zen.lib + '.css', zen.path('lib/article.css')]
            config.setup = () => Plugin()
        },
        inited(editor) {
            const elements =
                editor.contentDocument.body.getElementsByClassName("k-doc");
            for (let i = 0; i < elements.length; i++) {
                Doc(elements[i], true);
            }
        },
        save(content) {
            $.post({
                url: "/do/patch/note_content",
                data: { id: this.noteId, content },
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.k-block {
    :deep(.tox-tinymce) {
        border: 0
    }

    :deep(.tox-editor-header) {
        background: var(--a-bg-color);
    }

    :deep(.tox .tox-toolbar) {
        background: #fff !important;
        border-bottom: 1px solid #eee;
    }

    :deep(.tox-edit-area::before) {
        border: 0 !important;
    }

    :deep(.tox-edit-area__iframe) {
        padding: 20px;
    }
}
</style>
