<template>
    <z-action tooltip="编辑目标" size="small" link icon="edit" from="/do/get/goal" url="/do/patch/goal" :data="{ id: data.id }" :fields="fields"
        title="编辑目标" :finish="refresh" />
</template>
<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            fields: [
                { name: 'title', label: '标题', type: 'input' },
                { name: 'owner', label: '负责人', type: 'user' },
                {
                    name: 'cycle', label: '周期', type: 'radio', code: 'planCycle',
                },
                {
                    name: 'type', label: '类型', code: 'goalType',
                },
                {
                    name: 'range', label: '可见范围', code: 'visibleRange',
                },
                { name: 'currentValue', label: '当前完成值', type: 'number' },
                { name: 'startGmt', label: '开始时间', type: 'date' },
                { name: 'endGmt', label: '结束时间', type: 'date' },
                { name: 'targetValue', label: '目标值', type: 'number' },
                {
                    name: 'unit', label: '单位', code: 'goalUnit',
                },
            ]
        }
    },
    methods: {
        refresh() {
            this.$emit("refresh")
        }
    }
}
</script>
<style scoped lang="scss">
.edit {
    cursor: pointer;
}
</style>