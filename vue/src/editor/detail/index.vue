<template>
    <z-block url="/do/get/note" :params="params">
        <template #default="data">
            <Content :data="data" />
        </template>
    </z-block>
</template>
<script>
import Content from './content.vue';
export default {
    components: { Content },
    data() {
        return { params: null }
    },
    created() {
        this.params = { id: this.$route.query.id }
    }
}
</script>