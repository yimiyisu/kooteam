<template>
    <z-block url="/api/system/deepseek">
        <template #default="data">
            <z-form label-width="160px" url="/api/system/deepseek" :data="data" :fields="fields" />
        </template>
    </z-block>
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { label: "DeepSeek apikey", name: "deepseekApikey" },
            ]
        }
    }
}
</script>