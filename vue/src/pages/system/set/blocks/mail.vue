<template>
    <z-form v-if="data" label-width="160px" :data="data" :beforeSubmit="submit" :fields="fields" />
</template>
<script>
// 需要加密的字段
const encryptFields = ['mailPassword']
export default {
    data() {
        return {
            data: null,
            fields: [
                { label: "邮件服务地址", name: "mailHost", placeholder: "举例：smtp.exmail.qq.com" },
                { label: "邮件服务端口", name: "mailPort" },
                { label: "邮件账号", name: "mailUser" },
                { label: "账号密码", name: "mailPassword", tip: "加密存储，不回显不需要重复输入" }
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