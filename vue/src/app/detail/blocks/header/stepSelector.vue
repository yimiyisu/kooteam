<template>
    <el-select v-model="value['step']">
        <el-option v-for="item in setps" :key="item.id" :label="item.title" :value="item.id" />
    </el-select>
</template>
<script>
const cache = {};
export default {
    props: {
        value: Object
    },
    data() {
        return { setps: [] }
    },
    async created() {
        const { projectId, step } = this.value
        if (cache[projectId]) {
            this.setps = cache[projectId]
        } else {
            const projectInfo = await $.get({ url: "/do/get/project", data: { id: projectId } })
            cache[projectId] = projectInfo.todoGroup
            this.setps = projectInfo.todoGroup
        }
        if (step) {
            // 自动选中下一阶段
            this.setps.forEach((item, idx) => {
                if (item.id === step && idx < this.setps.length - 2) {
                    this.value['step'] = this.setps[idx + 1].id
                }
            })
        }
    },
}
</script>