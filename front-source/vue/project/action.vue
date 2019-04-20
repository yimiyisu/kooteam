<template>
    <ul @click="click">
        <li>
            <z-execute type="text" :action="'/project/favi.do?projectId='+id">收藏</z-execute>
        </li>
        <li>
            <z-wicket type="text" view="J_edit" :prop="value" size="small" title="重命名" action="/project/edit.do">重命名
            </z-wicket>
        </li>
        <li v-if="isOnwer">
            <z-wicket type="text" view="J_trans" size="small" :prop="value" title="请选择用户" action="/project/trans.do">
                转交项目
            </z-wicket>
        </li>
        <li v-if="isOnwer">
            <z-execute type="text" tip="确定删除吗？" :action="'/project/remove.do?_id='+id">删除</z-execute>
        </li>
        <li v-if="!isOnwer">
            <z-execute type="text" :action="'/project/quit.do?projectId='+id">退出</z-execute>
        </li>
    </ul>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                id: "",
                isOnwer: false
            }
        },
        mounted: function () {
            this.id = this.value._id;
            let uid = zen.user.id;
            if (this.value.owner === uid) {
                this.isOnwer = true;
            }
        },
        methods: {
            click: function (evt) {
                evt.stopPropagation();
            },
        }
    }
</script>