<template>
    <p><a href="https://yimiyisu.com" target="blank">杭州一米一粟信息科技有限公司</a> © 2019-2024
        <a v-if="info && info.icp" href="https://beian.miit.gov.cn/" target="_blank">
            {{ info.icp }}
        </a>
    </p>
</template>
<script>
export default {
    props: { info: Object }
};
</script>
<style scoped>
a {
    margin-left: 16px;
    color: #333;
    text-decoration: none;
}
</style>
