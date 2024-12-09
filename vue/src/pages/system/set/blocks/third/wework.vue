<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { name: 'weworkId', label: '企业ID' },
                { name: 'weworkAppId', label: '企业微信应用ID' },
                { name: 'weworkAppSecret', label: '应用Secret', tip: "加密存储，不回显不需要重复输入" }
            ]
        }
    }
}
</script>
