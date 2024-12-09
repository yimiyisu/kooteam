<template>
    <z-form label-width="160px" v-if="data" :data="data" :fields="fields" :beforeSubmit="submit" />
</template>
<script>
import Detail from './detail';

// 需要加密的字段
const encryptFields = ['bucketSK']
export default {
    data() {
        return {
            data: null,
            fields: [
                {
                    name: 'storageDomain', label: '空间访问域名', placeholder: '举例：https://res.yimiyisu.com'
                },
                {
                    name: 'storageMode', label: '存储模式', default: 'storageLocal', onChange: () => {
                    }, type: 'radiobox', options: [
                        { label: '本地存储', value: 'local' },
                        { label: '阿里云OSS', value: 'oss' },
                        { label: '腾讯云COS', value: 'cos' }
                    ]
                },
                { component: Detail },
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