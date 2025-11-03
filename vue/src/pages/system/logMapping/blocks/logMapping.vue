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
                    label: "日志配置",
                    name: "logMapping",
                    type: "table",
                    simple: false,
                    fields: [
                        { label: '应用名', width: '150px', name: 'name' },
                        { label: '应用标题', name: 'title' },
                    ]
                }
            ]
        }
    },
    async created() {
        const result = await $.get({ url: "/api/system/logMapping" })
        this.data = result || {}
    },
    methods: {
        async submit(data) {
            $.post({ url: "/api/system/logMapping", data: data })
            return false
        }
    },
}
</script>