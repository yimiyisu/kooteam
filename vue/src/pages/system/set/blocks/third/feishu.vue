<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { name: 'feishuAppId', label: 'App ID' },
                { name: 'feishuAppSecret', label: 'App Secret' }
            ]
        }
    }
}
</script>
