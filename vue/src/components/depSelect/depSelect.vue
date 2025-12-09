<template>
    <el-cascader v-bind="$attrs" :options="options" @change="change" :props="props" clearable />
</template>
<script>
export default {
    data() {
        return {
            props: {
                multiple: true,
                checkStrictly: true,
                value: 'id',
                label: 'title'
            },
            options: [],
            value: null
        }
    },
    async created() {
        this.options = await $.get({ url: '/api/plan/getEmpTree' })
    },
    methods: {
        change(val) {
            this.$emit('update:modelValue', val)
        }
    },
}
</script>