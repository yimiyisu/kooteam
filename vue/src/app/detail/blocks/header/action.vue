<template>
    <el-dropdown size="small" class="btn" type="warning" split-button @click="archive" @command="cmd">
        <z-icon value="archive" />归档
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="transfer">完成并转交</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <z-action ref="transfer" url="/do/patch/thing" :data="thing" width="480px" title="转交任务" :fields="fields"
        @finish="finish" />
</template>
<script>
import StepSelector from './stepSelector.vue';
export default {
    inject: ["log"],
    props: { value: Object },
    data() {
        return {
            fields: [
                { label: "转交对象", name: 'owner', type: 'user' },
                {
                    label: "下一阶段", name: 'step', component: StepSelector, visible: (val) => !!val.projectId
                }
            ]
        }
    },
    methods: {
        // 完成
        async archive() {
            const { value } = this;
            $.confirm("确定将该任务归档吗？", async () => {
                const data = {
                    id: value.id,
                    title: value.title,
                    content: JSON.stringify(value),
                    quadrant: value.quadrant,
                    projectId: value.projectId,
                    status: value.status,
                    owner: value.owner
                };
                // await $.post({ url: '/api/archive/put', data: { id: value.id,content:JSON.stringify(value) } })
                await $.post({ url: '/do/put/thing_archive', data: data })
                this.log("归档了任务", true);
                await $.post({ url: "/do/delete/thing", data: { id: value.id } })
                $.emit("thingUpdate", value, 'remove');
            })
        },
        async cmd(command) {
            const { value } = this;
            if (command === 'delete') {
                return $.confirm('确定删除该任务吗？', async () => {
                    await $.post({ url: "/do/delete/thing", data: { id: value.id } })
                    this.log("删除了任务");
                    $.emit("thingUpdate", value, 'remove');
                })
            }
            this.$refs.transfer.show()
        },
        finish(result, formData) {
            const { value } = this;
            value.status = 6;
            value.owner = formData.owner;
            $.post({ url: '/do/patch/thing', data: value })
            $.emit("thingUpdate", value, 'remove');
            this.log("将任务转交给了：" + $.nick(formData.owner))
        }
    },
};
</script>
<style lang="scss" scoped>
.btn {
    position: absolute;
    right: 10px;
    top: 0;
}
</style>