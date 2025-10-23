<template>
    <z-block url="/api/home/note" :params="params">
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
        return {
            params: null,
            url:null,
         }
    },
    created() {
        this.params = $.getParams()
    }
}
</script>