<template>
    <z-action tooltip="新增KR" size="small" link icon="plus" url="/do/put/goal_son" :fields="fields" title="新增KR"
        :beforeSubmit="beforeSubmit" :finish="refresh" />
</template>
<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            fields: [
                { name: 'title', label: '标题', type: 'input', default: '' },
                { name: 'description', label: '描述', type: 'textarea' },
                { name: 'unit', label: '单位', code: 'goalUnit' },
                { name: 'targetValue', label: '目标值', type: 'number' },
                { name: 'weight', label: '权重', type: 'number' },
                { name: 'cycle', label: '周期', code: 'planCycle' },
                { name: 'startGmt', label: '开始时间', type: 'date' },
                { name: 'endGmt', label: '结束时间', type: 'date' },
            ]
        }
    },
    methods: {
        beforeSubmit(data) {
            data.parentId = this.data.id
            return data
        },
        refresh() {
            this.$emit("refresh")
        }
    }
}
</script>