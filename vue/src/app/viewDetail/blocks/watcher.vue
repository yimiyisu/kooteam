<template>
    <el-row style="margin-top:12px">
        <el-col :span="1"><z-icon value="users" /> </el-col>
        <el-col :span="23">
            关注的人：
            <span class="user" v-for="uid in list" :key="uid">
                <z-avatar :value="uid" />
            </span>
            <span v-if="!list || list.length === 0" class="empty">暂无关注人</span>
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: "viewDetailWatcher",
    props: { value: Object },
    data() {
        return {
            list: null,
        };
    },
    created() {
        this.list = this.value.watchers || []
    },
};
</script>
<style lang="scss" scoped>
.user {
    padding-right: 12px;
    display: inline-block;

    :deep(.z-avatar) {
        margin-bottom: -8px;
    }
}

.empty {
    color: var(--a-text-color-secondary);
    font-size: var(--a-font-size-base);
}
</style>
