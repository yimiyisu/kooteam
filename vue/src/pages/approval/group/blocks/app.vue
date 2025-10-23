<template>
    <div>
        <z-table v-if="list" :datasource="list">
            <template #action$="{ row }">
                <z-action p="1l914hyllyt" :label="row.enable ? '禁用' : '启用'" mode="confirm" link :data="row"
                    :url="'/' + name + '/api/zen/flows'" />
                <z-action p="rgio2wg47g6" width="90%" label="流程编排" mode="drawer" :map="{ 'flowId': 'id' }" link :data="row"
                    href="/approval/node" />
            </template>
        </z-table>
        <el-empty v-else description="该模块暂无审批流" />
    </div>
</template>
<script>
import configs from './configs';
export default {
    provide: { configs },
    props: {
        name: String,
        list: Array
    }
}
</script>