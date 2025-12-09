<template>
    <el-card style="width: 100%;height: 230px">
        <el-row>
            <el-col :span="12">
                <div class="title">整体完成度</div>
                <el-progress type="circle" :percentage="percentage" :colors="colors" :stroke-width="20" class="circle" />
            </el-col>
            <el-col :span="1">
                <el-divider direction="vertical" style="height: 90%;" />
            </el-col>
            <el-col :span="11">
                <div class="title">整体评分</div>
                <el-rate v-model="rate" disabled show-score text-color="#ff9900" score-template="{value} points"
                    class="circle" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            percentage: 25,
            colors: [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 },
            ],
            rate: 3.7,
        }
    }
}
</script>
<style lang="scss" scoped>
.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
}

.circle {
    display: flex;
    width: 120px;
    height: 120px;
    margin: 40px auto;
}
</style>