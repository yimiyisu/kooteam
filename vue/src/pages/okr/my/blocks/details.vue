<template>
    <z-action tooltip="详情" size="small" link icon="info" url="/do/get/goal" :data="{ id: data.id }" title="详情" />
</template>
<script>
export default {
    props: {
        data: Object
    }
}
</script>
<style scoped lang="scss">
.details {
    width: 100%;
    height: 100%;
}
</style>