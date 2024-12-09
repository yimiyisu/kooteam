<template>
    <z-form v-if="data" label-width="160px" :data="data" :beforeSubmit="submit" :fields="fields" />
</template>
<script>
// 需要加密的字段
const encryptFields = ['redisPassword']
export default {
    data() {
        return {
            data: null,
            fields: [
                { label: "CDN域名", name: "cdnDomain", placeholder: "举例：https://a.ebus.vip" },
                { label: "前端基础库版本", name: "uiVersion" },
                { label: "前端应用版本", name: "appVersion" },
                { label: "Redis地址", name: "redisAddress" },
                { label: "Redis密码", name: "redisPassword", placeholder: "非必填" }
            ]
        }
    },
    async created() {
        const result = await $.get({ url: "/api/zen/set" })
        const selfs = {}
        if (result && result.selfs) {
            result.selfs.forEach(({ name, value }) => {
                if (name === 'loginPassword') {
                    selfs[name] = value
                } else {
                    if (value && value.indexOf('_$$') === -1) {
                        selfs[name] = value
                    }
                }
            })
        }
        this.data = selfs
    },
    methods: {
        async submit(data) {
            const selfs = [];
            await Object.keys(data).forEach((name) => {
                // 是否加密配置
                const encrypt = encryptFields.includes(name) ? 1 : 0
                selfs.push({ name, value: data[name], encrypt })
            })
            $.post({ url: "/api/zen/set", data: { selfs } })
            return false
        }
    },
}
</script>
