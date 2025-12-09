<template>
    <z-form v-if="data" label-width="160px" :data="data" :beforeSubmit="submit" :fields="fields" />
</template>
<script>
import ISettings from '@icons/settings';
import AppSet from './appSet.vue';
// 需要加密的字段
export default {
    props: {
        modelValue: Object
    },
    data() {
        return {
            data: null,
            ISettings,
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
                        { label: '是否启用', name: 'status', width: '80px', type: 'switch', default: 1 },
                        { label: '更多设置', name: 'st', component: AppSet },
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