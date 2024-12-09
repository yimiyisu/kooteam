<template>
    <el-tabs v-model="activeName" type="card" @tab-change="change">
        <el-tab-pane label="我负责的" name="onwer"></el-tab-pane>
        <el-tab-pane label="我创建的" name="created"></el-tab-pane>
    </el-tabs>
    <z-table name="10qzirbm0zw" :url="url">
        <template #title="{ row }">
            <a-thing :data="row" />
        </template>
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';
const defaultURL = '/do/select/myThing'

export default {
    name: 'p-10qzirbm0zw',
    provide: { configs },
    data() {
        return { activeName: 'onwer', url: defaultURL }
    },
    methods: {
        change() {
            this.url = this.activeName === 'onwer' ? defaultURL : '/do/select/createdThing'
        }
    },
}
</script>