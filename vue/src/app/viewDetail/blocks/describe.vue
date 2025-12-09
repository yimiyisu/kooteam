<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="list" />
        </el-col>
        <el-col :span="23">
            <div>
                详细描述
            </div>
            <div v-html="value.content || '暂无描述'" class="article-body mce-content-body" />
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: "viewDetailDescribe",
    props: ["value"],
    data() {
        return {};
    },
};
</script>
<style scoped lang="scss">
.a-row {
    margin-top: 16px;
}

.article-body {
    min-height: 200px;
    padding: 10px;
}
</style>

