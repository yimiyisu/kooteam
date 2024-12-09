<template>
    <z-action icon="logOut" :type="type" :label="label" :data="params" title="确定退出该项目吗?" mode="confirm"
        url="/do/delete/projectUserForQuit" />
</template>
<script>
export default {
    props: {
        label: String,
        type: {
            type: String,
            default: 'text'
        },
        projectId: String
    },
    computed: {
        params: function () {
            const { projectId } = this;
            return { projectId }
        }
    }
}
</script>