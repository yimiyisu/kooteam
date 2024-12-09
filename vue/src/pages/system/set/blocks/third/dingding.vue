<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { name: 'dingAppId', label: 'App ID' },
                { name: 'dingAgentId', label: 'Agent ID' },
                { name: 'dingClientId', label: 'Client ID' },
                { name: 'dingSecret', label: 'Client Secret', tip: "加密存储，不回显不需要重复输入" }
            ]
        }
    }
}
</script>
