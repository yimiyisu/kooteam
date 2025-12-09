<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="gitMerge" />
        </el-col>
        <el-col :span="23">
            <strong>子任务列表</strong>
            <el-progress v-if="list && list.length > 0" status="success" :percentage="percent" />
            <div class="empty" v-else>暂无子任务</div>
            <Thing v-for="(item) in list" :key="item.id" :value="item" />
        </el-col>
    </el-row>
</template>
<script>
import Thing from "./thing";
export default {
    components: { Thing },
    props: {
        value: Object,
        list: Array,
    },
    computed: {
        percent() {
            let length = this.list.length,
                number = 0;
            this.list.forEach((item) => item.status && number++);
            if (length === 0) {
                return 0;
            }
            number = parseInt((number / length) * 100);
            return number;
        },
    },
};
</script>
<style lang="scss" scoped>
.empty,
.a-progress {
    margin: 15px 0 10px 0;
}

.a-row {
    padding-top: 20px;
}
</style>

