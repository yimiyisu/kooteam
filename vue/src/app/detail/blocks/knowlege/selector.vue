<template>
    <div>
        <el-row :gutter="30">
            <el-col :span="12">
                <z-table url="/do/join/myNote" :condition="condition" :columns="columns" size="10" @finish="finish">
                    <template #title="{ row }">
                        <el-link @click="select(row)">{{ row.title }}</el-link>
                    </template>
                </z-table>
            </el-col>
            <el-col :span="12">
                <el-tree ref="tree" :check-strictly="true" :node-key="tag" :data="treeData" :props="defaultProps"
                    show-checkbox />
            </el-col>
        </el-row>
        <div class="z-form-action">
            <el-button @click="close">关闭</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>
<script>
export default {
    inject: ['$button'],
    data() {
        return {
            condition: [{ name: 'title', placeholder: '请输入关键字搜索' }],
            columns: [{ name: 'title', label: '知识库名' }],
            defaultProps: {
                children: 'sons',
                label: 'title',
                disabled: (data) => !data.id,
            },
            current: null,
            treeData: null
        }
    },
    methods: {
        finish(result) {
            if (result && result.list) {
                this.select(result.list[0])
            }
        },
        async select(result) {
            const { id: noteId } = result
            if (this.current === noteId) {
                return
            }
            this.current = noteId
            const note = await $.get({ url: '/do/get/note', data: { id: noteId } })
            this.treeData = note.content
        },
        close() {
            this.$button.close()
        },
        confirm() {
            const data = this.$refs['tree'].getCheckedNodes()
            if (!data || data.length === 0) {
                return $.error("请先选择文档");
            }
            this.$emit("update", data.map((item) => item.id));
            this.close()
        }
    },
}
</script>
<style lang="scss" scoped>
.a-text {
    display: block;
    line-height: 24px;
    cursor: pointer;
}
</style>