<template>
    <z-action id="J_material" type="text" label="插入待办" :beforeSubmit="submit" ref="action" width="840px">
        <el-tabs v-model="defaultTab" class="demo-tabs">
            <el-tab-pane label="我负责的" name="onwer">
                <z-table url="/do/select/myThing" :size="10" :condition="condition" :columns="myColumns"
                    :actionWidth="80">
                    <template #action$="{ row }">
                        <el-button type="primary" link @click="select(row)">选择</el-button>
                    </template>
                </z-table>
            </el-tab-pane>
            <el-tab-pane label="我创建的" name="created">
                <z-table url="/do/select/createdThing" :size="10" :condition="condition" :columns="createdColumns"
                    :actionWidth="80">
                    <template #action$="{ row }">
                        <el-button type="primary" link @click="select(row)">选择</el-button>
                    </template>
                </z-table>
            </el-tab-pane>
        </el-tabs>
    </z-action>
</template>

<script>
export default {
    provide() {
        return {
            configs: {},
        }
    },
    props: {
        editor: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            defaultTab: 'onwer',
            condition: ['title'],
            myColumns: [
                { label: '标题', name: 'title' },
                { label: '优先级', name: 'quadrant', code: 'quadrantType' },
                { label: '状态', name: 'status', code: 'thingStatus' },
                { label: '负责人', name: 'owner' },
                { label: '创建时间', name: 'createGmt' },
            ],
            createdColumns: [
                { label: '标题', name: 'title' },
                { label: '优先级', name: 'quadrant', code: 'quadrantType' },
                { label: '状态', name: 'status', code: 'thingStatus' },
                { label: '负责人', name: 'owner' },
                { label: '创建时间', name: 'createGmt' },
            ],
        };
    },
    methods: {
        async submit(formData) {
            console.log('formData', formData);
            const articleId = $.getParam('article');
            const result = await $.post({
                url: "/do/put/note_content",
                data: { parentId: articleId, type: 7 },
            });
            this.editor.commands.insertContent({
                type: "taskNode",
                attrs: { ...formData, id: result.id },
            });
        },
        async select(row) {
            const formData = {
                label: row.title,
                thingId: row.id,
            };
            await this.submit(formData);
            this.$refs.action.close();
        },
    },
};
</script>