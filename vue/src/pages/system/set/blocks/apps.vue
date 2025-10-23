<template>
    <z-form v-if="data" label-width="160px" :data="data" :beforeSubmit="submit" :fields="fields" />
</template>
<script>
// 需要加密的字段
export default {
    data() {
        return {
            data: null,
            fields: [
                {
                    label: "应用列表",
                    name: "apps",
                    type: "table",
                    simple: false,
                    fields: [
                        { label: '应用名', width: '150px', name: 'name' },
                        { label: '应用标题', name: 'title' },
                        { label: '别名', name: 'alias' },
                        { label: '是否启用', name: 'status', width: '80px', type: 'switch', default: 1 }
                    ]
                }
            ]
        }
    },
    async created() {
        const result = await $.get({ url: "/api/system/apps" })
        this.data = result || {}
    },
    methods: {
        async submit(data) {
            $.post({ url: "/api/system/apps", data: data })
            return false
        }
    },
}
</script>