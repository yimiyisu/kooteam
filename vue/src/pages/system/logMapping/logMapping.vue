<template>
    <el-tabs v-model="current">
        <el-tab-pane label="日志配置" name="logMapping">
            <div style="width:720px">
                <LogMapping v-if="current === 'logMapping'" />
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import LogMapping from './blocks/logMapping.vue';

export default {
    components: { LogMapping },
    data() {
        return {
            current: 'logMapping',
        }
    },
}
</script>
