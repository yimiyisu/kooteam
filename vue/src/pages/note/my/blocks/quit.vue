<template>
    <z-action icon="logOut" :type="type" :label="label" :data="params" title="确定退出该知识库吗?" mode="confirm"
        url="/do/delete/note_user" />
</template>
<script>
export default {
    props: {
        label: String,
        type: {
            type: String,
            default: 'text'
        },
        noteId: String
    },
    computed: {
        params: function () {
            return { id: this.noteId }
        }
    }
}
</script>