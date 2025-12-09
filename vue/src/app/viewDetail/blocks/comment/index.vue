<template>
    <div class="comment">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="评论列表" name="command" lazy>
                <List :value="value" />
            </el-tab-pane>
            <el-tab-pane label="操作记录" name="operator" lazy>
                <Log :value="value" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import List from "./list";
import Log from "./log";
export default {
    name: "viewDetailComment",
    components: { List, Log },
    props: { value: Object },
    data() {
        return {
            activeName: 'command'
        };
    }
};
</script>
<style lang="scss" scoped>
.comment {
    margin-top: -12px;
}
</style>

