<template>
    <div class="title">
        <logo />
        <AppList />
    </div>
</template>
<script>
import AppList from './appList.vue';
import logo from './logo.vue';
export default {
    components: { logo, AppList },
}
</script>
<style lang="scss" scoped>
.title {
    position: absolute;
    left: 10px;
    top: 6px;

    :deep(svg) {
        width: 108px;
    }
}
</style>
