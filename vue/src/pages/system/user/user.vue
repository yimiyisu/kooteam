<template>
    <z-table title="用户管理" :columns="columns" :condition="searchFields" url="/api/zen/userList">
        <template #header$>
            <z-action label="添加用户" width="520" :fields="addFields" url="/api/zen/addUser" />
        </template>
        <template #status="{ row }">
            <el-tag v-if="hasTag(row.tag, 12)" type="info">已禁用</el-tag>
            <el-tag v-else type="success">正常</el-tag>
        </template>
        <template #action$="{ row }">
            <z-action label="修改角色" :fields="roleFields" url="/api/zen/setUser" :data="row" link
                :title="'编辑[' + row.nick + ']角色'" />
            <z-action v-if="row.username" width="480" :fields="editFields" label="修改密码" url="/api/zen/setUser"
                :data="row" link :title="'修改【' + row.nick + '】密码'" />
            <z-action :label="hasTag(row.tag, 12) ? '解禁' : '禁用'" mode="confirm" url="/api/zen/setUser" :data="row"
                link />
        </template>
    </z-table>
</template>
<script>
import configs from './configs';

export default {
    name: 'userList',
    provide: { configs: { entitys: configs } },
    data() {
        return {
            columns: ['nick', 'role', 'username', 'status', 'createGmt'],
            addFields: ['username', 'nick', 'password', 'password2'],
            editFields: ['password', 'password2'],
            roleFields: ['role'],
            searchFields: ['keyword'],
        }
    },
    methods: {
        hasTag(value, tag) {
            return $.hasTag(value, tag)
        }
    },
}
</script>
