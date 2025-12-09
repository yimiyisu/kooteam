<template>
    <z-block url="/do/get/goal" :params="params">
        <template #default="data">
            <Header :value="data" />
            <el-tabs v-model="activeName">
                <el-tab-pane label="OKRs" name="okrs">
                    <Krs :value="params" :visible="true" />
                </el-tab-pane>
                <el-tab-pane label="E-执行" name="execute">
                    <Execute :value="params" />
                </el-tab-pane>
                <el-tab-pane label="进展" name="progress">
                    <Progress :params="params" />
                </el-tab-pane>
                <el-tab-pane label="互动" name="interaction">互动</el-tab-pane>
                <el-tab-pane label="复盘" name="review">
                    <z-block href="/okr/review" :params="{ targetId: params.id }" />
                </el-tab-pane>
                <el-tab-pane label="基本信息" name="basic">
                    <Basic :params="data.id" />
                </el-tab-pane>
            </el-tabs>
        </template>
    </z-block>
</template>

<script>
import Krs from '../myOkr/blocks/krs.vue';
import Basic from './blocks/basic.vue';
import Execute from './blocks/execute/execute.vue';
import Header from './blocks/header.vue';
import Progress from './blocks/progress.vue';
export default {
    components: {
        Header, Krs, Progress, Execute, Basic
    },
    data() {
        return {
            activeName: 'okrs'
        };
    },
    created() { },
    props: {
        params: Object
    }
};
</script>