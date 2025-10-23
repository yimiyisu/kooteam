<template>
    <el-row :gutter="14">
        <el-col :span="8">
            <el-button style="margin:6px 12px" type="primary" @click="submit">保存</el-button>
            <el-scrollbar max-height="75vh">
                <el-tree ref="tree" :data="treeData" check-strictly default-expand-all :check-on-click-leaf="false"
                    @check-change="select" @current-change="select" :props="treeProps"
                    :default-checked-keys="roleData.permissions" show-checkbox node-key="id" />
            </el-scrollbar>
        </el-col>
        <el-col :span="14">
            <Points v-if="current" :page="current.name" @update="update" :points="points" :pointData="pointData" />
        </el-col>
    </el-row>
</template>

<script>
import Points from './points.vue';
export default {
    components: { Points },
    props: {
        data: Object,
        roleId: String,
        appName: String
    },
    data() {
        return {
            treeData: [],
            points: {},
            roleData: null,
            current: null,
            pointData: null,
            treeProps: { value: 'id', label: 'label' },
        };
    },
    async created() {
        const params = { roleId: this.roleId, app: this.appName }
        this.roleData = params
        const result = await $.get({ url: "/do/get/role_app", data: params })
        if (result) {
            this.roleData.id = result.id
            this.roleData.permissions = result.permissions
            this.points = result.points || {}
        }
        this.treeData = this.buildTree(this.data)
        const configData = await $.get({ url: `/${this.appName}/api/zen/points` })
        this.pointData = JSON.parse(configData || '{}')
    },
    methods: {
        select(target, node) {
            this.current = node === true || node.checked ? target : null
        },
        update(path, data) {
            this.points[path] = data
        },
        buildTree(data, parentId = '0') {
            return data.filter(item => item.parentId === parentId)
                .map(item => ({
                    ...item,
                    children: this.buildTree(this.data, item.id)
                }));
        },
        async submit() {
            const { roleData, points } = this
            roleData.permissions = this.$refs.tree.getCheckedKeys();
            const url = roleData.id ? '/do/patch/role_app' : '/do/put/role_app';
            const { id } = await $.post({ url, data: { ...roleData, points } }, this);
            id && (this.roleData['id'] = id)
        },
    }
};
</script>