<template>
    <z-action fixed="projectDetail" width="90%" :beforeShow="show" mode="drawer" :title="title + '-项目详情'">
        <el-tabs v-if="project" v-model="current">
            <el-tab-pane label="任务看板" name="todo">
                <Board :value="project" />
            </el-tab-pane>
            <el-tab-pane label="全部任务" name="list" lazy>
                <z-block href="/projects/todoList" :params="params" />
            </el-tab-pane>
            <el-tab-pane label="归档的任务" name="archive" lazy>
                <z-block href="/projects/archive" :params="params" />
            </el-tab-pane>
            <!-- <el-tab-pane label="知识库" name="knowlege" lazy>
                知识库管理
            </el-tab-pane> -->
            <!-- <el-tab-pane label="文件管理" name="file" lazy>
                文件管理模块
            </el-tab-pane> -->
        </el-tabs>
    </z-action>
</template>
<script>
import Board from './board/index.vue';
export default {
    components: { Board },
    data() {
        return {
            current: null,
            title: '',
            params: null,
            project: null
        }
    },

    methods: {
        async show({ id }) {
            this.params = { projectId: id }
            this.current = 'todo'
            const result = await $.get({ url: "/do/get/project", data: { id } })
            this.title = result.title
            this.project = result
        }
    },
}
</script>