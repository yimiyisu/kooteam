<template>
    <z-action icon="logOut" :type="type" :label="label" :data="params" title="确定退出该知识库吗?" mode="confirm"
        url="/do/delete/note_user" @finish="finish" />
</template>
<script>
export default {
    inject: ["$table"],
    props: {
        label: String,
        type: {
            type: String,
            default: 'text'
        },
        relateId: String
    },
    computed: {
        params: function () {
            return { id: this.relateId }
        }
    },
    methods: {
        finish() {
            this.$table.reload()
        }
    },
}
</script>