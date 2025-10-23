<template>
    <z-block url="/do/list/approval_node" :params="$map">
        <template #default="nodes">
            <z-com v-if="visible" class="flowable" type="flowable" :nodes="nodes" />
        </template>
    </z-block>
</template>
<script>
export default {
    inject: ["$map"],
    data() {
        return {
            visible: false
        }
    },
    computed: {
        params() {
            return {}
        }
    },
    async created() {
        await $.lib('flowable.js')
        this.visible = true
    },
}
</script>
<style scoped>
:v-deep(.flowable) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%
}
</style>