<template>
    <div class="bgs"></div>
    <el-row class="z-rows3">
        <el-col :span="6" @click="tolink1">
            <z-icon value="layers" />待办四象限</el-col>
        <el-col :span="6"> <z-icon value="ipackage" />项目管理</el-col>
        <el-col :span="6"> <z-icon value="book" />在线知识库</el-col>
        <el-col :span="6"> <z-icon value="calendar" />日程管理</el-col>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            tolink() {
                this.$refs["link"].scrollIntoView(true);
            },
        };
    },
};
</script>
<style scoped>
.bgs {
    transform: skewY(-4.5deg);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--a-color-primary);
}

.z-rows3 {
    z-index: 2;
    position: relative;
    font-size: 22px;
    max-width: 1400px;
    margin: 0 auto;
    line-height: 220px;
}

.a-icon {
    margin-right: 6px;
}
</style>
