<template>
    <z-block url="/do/get/goal" :params="params">
        <template #default="data">
            <Info :value="data" />
            <el-tabs v-model="activeName">
                <el-tab-pane label="进展" name="progress">
                    <Progress :params="{ id: data.id }" />
                </el-tab-pane>
                <el-tab-pane label="互动" name="interaction">互动</el-tab-pane>
                <el-tab-pane label="复盘" name="review">
                    <z-block href="/okr/review" :params="{ targetId: params.id }" />
                </el-tab-pane>
            </el-tabs>
        </template>
    </z-block>
</template>

<script>
import Progress from '../goalDetail/blocks/progress.vue';
import Info from './blocks/info.vue';
export default {
    props: {
        params: Object
    },
    components: {
        Info, Progress
    },
    data() {
        return {
            activeName: 'progress'
        };
    },
    created() { },
};
</script>