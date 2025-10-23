<template>
    <z-block url="/do/select/approval_node">
        <template>
            <z-com v-if="visible" class="design" type="pager" :pageId="params.id" />
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
        await $.resource('/pager.js')
        this.visible = true
    },
}
</script>