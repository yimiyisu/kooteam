<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <z-page-title value="部门管理" />
            <z-action label='添加部门' mode='dialog' :fields="['title', 'titleEn', 'order', 'isLeaf']" type='primary'
                @finish="(result,formData) => addFinish(result,formData, node)" url='/do/put/department' />
            <z-action label='同步' mode="confirm" title='确定要同步部门吗？' url="/api/system/rsyncDepartment" />
            <el-tree ref="tree" node-key="id" :props="props" :load="loadNode" lazy style="margin-top: 6px">
                <template #default="{ data, node }">
                    <span class="custom-tree-node">
                        <span class="title" @click="select(data)">{{ data.title }}</span>
                        <span class="action">
                            <z-action icon="plus" type="text" :title="'添加' + data.title + '子部门'"
                                url="/do/put/department" :data="{ parentId: data.id }"
                                :fields="['title', 'titleEn', 'order', 'isLeaf']" style="margin-right:12px"
                                v-if="data.isLeaf == 0" @finish="(result,formData) => addFinish(result,formData, node)" />
                            <z-action icon="edit" type="text" :title="'编辑' + data.title + '子部门'"
                                url="/do/patch/department" :data="data"
                                :fields="['title', 'titleEn', 'order', 'isLeaf']" style="margin-right:12px"
                                @finish="(result) => edit(result, node)" />
                            <z-action icon="x" type="text" url="/do/delete/department" mode="confirm" :data="data"
                                :title="'刪除' + data.title + '部门'" @finish="() => remove(data)" />
                        </span>
                    </span>
                </template>
            </el-tree>
        </el-col>
        <el-col :span="18">
            <z-block href="/system/employee" :params="params" />
        </el-col>
    </el-row>
</template>

<script>
import configs from './.lowcode/configs';

export default {
    name: 'p-h688tdfn',
    provide: { configs },
    data() {
        return {
            params: null,
            props: {
                isLeaf: (data) => data.isLeaf === 1
            },
            defaultId: null,
        }
    },

    async created() {
        const { id } = this.$route.query
        if (id) {
            this.defaultId = id
            this.params = { id }
        }
    },

    methods: {
        select(data) {
            this.params = { departmentId: data.id }
            this.$router.push({ query: { departmentId: data.id } })
        },
        nodePath(node, result) {
            const { data, parent } = node
            result.unshift(data.title)
            return this.nodePath(parent, result)
        },
        async loadNode(node, callback) {
            const result = await $.get({ url: "/do/list/department", data: { parentId: node.data.id } })
            const data = Array.isArray(result) ? result : [];
            callback(data);
        },
        async addFinish(result, formData, node) {
            result.isLeaf = formData.isLeaf
            if (node) {
                if (!node.loaded) {
                    // 当节点还未加载时，把新添加的子节点暂存起来
                    node.newChildren = node.newChildren || [];
                    if (!node.newChildren.some(child => child.id === result.id)) {
                        node.newChildren.push(result);
                    }
                } else {
                    // 节点已加载，则直接追加前先检查是否重复
                    const exists = node.childNodes.some(child => child.data.id === result.id);
                    if (!exists) {
                        this.$refs.tree.append(result, node);
                    }
                }
            } else {
                this.$refs['tree'].append(result)
            }
        },
        edit(result, node) {
            console.log(node);
            node.data.title = result.title
        },
        remove(data) {
            this.$refs['tree'].remove(data.id)
        },
    },
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
}

.title {
    flex: 1;
}

.action {
    width: 80px;
    text-align: right;
}

:deep(.z-action---text) {
    padding-left: 8px;
}
</style>