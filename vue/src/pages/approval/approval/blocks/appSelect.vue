<template>
    <el-form-item label="审批应用">
        <el-select v-model="value" placeholder="请选择应用" @visible-change="getList" @change="select" clearable>
            <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
    </el-form-item>
</template>

<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            appList: [],
            value: '',
        };
    },
    methods: {
        select() {
            this.data.groupName = this.value
        },

        async getList(isVisible) {
            if (isVisible) {
                const appResult = await $.get({ url: "/api/system/apps" })
                this.appList = appResult.apps
            }
        }
    }
};
</script>
