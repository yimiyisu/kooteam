<template>
    <el-scrollbar height="100vh">
        <z-datav v-if="loaded" v-model="content" @change="change" />
    </el-scrollbar>
</template>

<script>
export default {
    props: {
        params: Object
    },
    data() {
        return { content: null, loaded: false }
    },
    async mounted() {
        const { id } = this.params
        let result = await $.get({ url: '/do/get/datav', data: { id } })
        this.content = {
            id,
            data: result.data || {},
            config: result.config || { sons: [] },
        }
        this.loaded = true
    },
    methods: {
        async change(page) {
            const { id, config, data } = page
            await $.post({ url: '/do/patch/datav', data: { id, config, data } })
        }
    },
};
</script>
<style scoped lang="scss">
.a-scrollbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>