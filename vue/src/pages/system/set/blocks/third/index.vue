<template>
    <z-form label-width="160px" v-if="data" :data="data" :fields="fields" :beforeSubmit="submit" />
</template>
<script>
import Detail from './detail';
// 需要加密的字段
const encryptFields = ['weworkAppSecret', 'dingSecret', 'feishuAppSecret']
export default {
    data() {
        return {
            data: null,
            fields: [
                {
                    name: 'loginMode', label: '登录模式', type: 'radiobox',
                    options: [
                        { label: '钉钉平台', value: 'dingding' },
                        { label: '企业微信平台', value: 'wework' },
                        { label: '飞书平台', value: 'feishu' },
                        { label: '域账户LADP', value: 'ladp' }
                    ]
                },
                { component: Detail },
                { name: 'loginPassword', label: '启用密码登录', default: 1, type: 'switch' },
            ],
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