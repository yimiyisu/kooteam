<template>
    <el-card class="tree">
        <div>
            <z-icon value="cornerUpRight" />
            <span>对齐目标</span>
        </div>
        <el-tree :data="[treeData]" :props="defaultProps" :default-expand-all="true">
            <template #default="{ data }">
                <div class="custom-tree-node">
                    <div class="node-left">
                        <z-action :map="{ 'parentId': 'id', 'planId': 'planId' }" link href="/performance/krs"
                            :title="data.title" :label="data.title" mode="drawer" class="node-label" />
                        <!-- 类型 1企业 3部门 5团队 7个人-->
                        <z-dict v-if="data.type !== 0" :modelValue="data.type" code="goalType" type="text" />
                        <!-- 可见范围 -->
                        <z-dict v-if="data.range !== 0" :modelValue="data.range" code="visibleRange" type="text" />
                        <el-button type="text" @click="handleOperation(data)">
                            <template #icon>
                                <template v-if="data.parentId == 0">
                                    <AddKr :data="data" @refresh="refresh" />
                                </template>
                                <Edit :data="data" @refresh="refresh" />
                                <ITrash2 @click="handleDelete(data)" :size="24" color="#f56c6c" />
                            </template>
                        </el-button>
                    </div>
                    <div class="node-right">
                        <z-user :value="data.owner" />
                        <el-rate v-model="data.score" disabled allow-half />
                        <!--process 完成度 cruuentValue 完成值 -->
                        <el-progress :percentage="data.process" type="circle" :text-inside="true" :width="30" />
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>
</template>
<script>
import ITrash2 from '@icons/trash-2'
import AddKr from './addKr.vue'
import Edit from './edit.vue'
export default {
    props: {
        treeData: Object,
    },
    components: {
        Edit,
        AddKr,
        ITrash2
    },
    created() {
        console.log("treeData", this.treeData)
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label',
            },
        }
    },
    methods: {
        async handleDelete(data) {
            $.confirm("确定要删除该目标吗？", async () => {
                await $.post({ url: "/do/delete/goal", data: { id: data.id } })
                this.refresh()
            })
        },
        refresh() {
            this.$emit("refresh")
        }
    }
}
</script>
<style lang="scss" scoped>
.tree {
    width: 100%;
    height: 100%;
    font-size: 16px;
    margin-top: 20px;
}

.custom-tree-node {
    width: 100%;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

}

.node-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.node-label {
    padding: 0 8px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}

.node-label:hover {
    color: #409EFF;
}

.node-type {
    color: #666;
    line-height: 24px;
    margin-right: 8px;
}

.node-right {
    display: flex;
    align-items: center;
    gap: 16px;
}
</style>