<template>
    <z-form v-if="data" label-width="160px" :data="data" :beforeSubmit="submit" :fields="fields" />
</template>
<script>
// 需要加密的字段
const encryptFields = ['wxMiniAppSecret', 'wxOpenSecret']
export default {
    data() {
        return {
            data: null,
            fields: [
                {
                    label: "微信小程序配置",
                    tip: "小程序授权",
                    children: [
                        { label: "小程序appid", name: "wxMiniAppId" },
                        { label: "小程序secret", tip: "加密存储，不回显不需要重复输入", name: "wxMiniAppSecret" }
                    ]
                },
                {
                    label: "微信开放平台配置",
                    tip: "H5页面公众号授权",
                    children: [
                        { label: "开发平台appid", name: "wxOpenId" },
                        { label: "开放平台secret", tip: "加密存储，不回显不需要重复输入", name: "wxOpenSecret" }
                    ]
                },

            ]
        }
    },
    async created() {
        const result = await $.get({ url: "/api/zen/set" })
        const selfs = {}
        if (result && result.selfs) {
            result.selfs.forEach(({ name, value }) => {
                if (value && value.indexOf('_$$') === -1) {
                    selfs[name] = value
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
