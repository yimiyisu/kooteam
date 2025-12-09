<template>
    <el-card class="add" @click="add">
        <z-action ref="add" tooltip="创建目标" icon-size="23" link icon="plus" url="/do/put/goal_parent" :fields="fields" title="创建目标" :finish="refresh"/>
        <span class="add-content" >创建目标</span>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { name: 'title', label: '标题', type: 'input' },
                { name: 'owner', label: '负责人', type: 'user' },
                { name: 'type', label: '类型',  code: 'goalType'},
                { name: 'startGmt', label: '开始时间', type: 'date' },
                { name: 'endGmt', label: '结束时间', type: 'date' },
                { name: 'range', label: '可见范围',  code: 'visibleRange'},
            ]
        }
    },
    methods: {
        add() {
            this.$refs['add'].show()
        },
        refresh() {
            this.$emit("refresh")
        }
    }
}
</script>
<style lang="scss" scoped>
.add {
    margin: 20px 0;
    width: 100%;
    height: 50px;
}

.add-content {
    cursor: pointer;
    font-size: 16px;
}
.add:hover {
    color: #409EFF;
}
</style>