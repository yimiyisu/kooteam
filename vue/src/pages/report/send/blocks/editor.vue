<template>
    <el-form-item label="工作详情">
        <z-editor v-model="data['content']" ref="editor" :beforeInit="beforeInit" @save="save" />
        <z-action ref="thingAction" width="800px" title="插入处理的任务" href="/report/thingSelector"
            :beforeSubmit="insertThings">
        </z-action>
    </el-form-item>
</template>
<script>
import Template from './template';
export default {
    props: { data: Object },
    async created() {
        if (!this.data.content) {
            this.data.content = Template()
        }
    },
    methods: {
        select(things) {
            console.log('things', things)
            this.$refs['editor'].insertContent('插入代办事项');
        },
        beforeInit(config) {
            config.toolbar = 'thing ' + config.toolbar
            config.plugins += ' thing importcss'
            config.content_css = [zen.lib + '.css', zen.path('lib/article.css')]
            config.setup = () => {
                tinymce.PluginManager.add("thing", (editor) => {
                    editor.ui.registry.addButton("thing", {
                        tooltip: "插入代办任务",
                        icon: "checkmark",
                        onAction: () => {
                            this.$refs['thingAction'].show()
                        },
                    });
                });
            }

        },
        insertThings(data) {
            console.log(data)
            const tableSelected = data.tableSelected;
            if (Array.isArray(tableSelected)) {
                let insertText = '';
                tableSelected.forEach(list => {
                    const id = list.id;
                    const quadrant = list.quadrant;
                    const status = list.status;
                    const title = list.title;
                    // insertText += `<li>编号id: ${id}, 紧急象限: ${quadrant},是否完成: ${status},待办标题: ${title}</li>`;
                    insertText += `<li style="color:var(--a-color-primary);font-weight:bold;text-decoration: underline;">${title}</li>`;
                    console.log(`编号id: ${id}, 紧急象限: ${quadrant},是否完成: ${status},待办标题: ${title}`);
                });
                if (insertText) {
                    this.$refs['editor'].insertContent(`相关待办事件:<ul>${insertText}</ul>`);
                }
            }
        },
        save(content) {
            $.post({ url: '/do/patch/note_content', data: { id: this.id, content } })
        }
    },
}
</script>
<style lang="scss" scoped>
:deep(.tox-edit-area) {
    margin: 12px;

    &::before {
        border: 0 !important;
    }
}
</style>