<template>
    <el-dropdown size="small" class="btn" type="warning" split-button @click="doFinish" @command="cmd">
        <span class="a-text" v-if="value.status === 6"><z-icon value="xSquare" />取消完成</span>
        <span class="a-text" v-else><z-icon value="checkSquare" />完成</span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="transfer">完成并转交</el-dropdown-item>
                <el-dropdown-item command="archive">归档</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <z-action ref="transfer" url="/do/patch/thing" width="480px" title="转交任务" :fields="fields"
        :beforeSubmit="transfer" />
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
        async doFinish() {
            let thing = this.value;
            let id = thing.id;
            let status = thing.status === 0 ? 6 : 0;
            let param = { id, status };
            await $.post({ data: param, url: "/do/patch/thing" });
            thing["status"] = status;
            let parent = this.$parent;
            if (parent.sort) {
                parent.sort(id, status);
            }
            let content = status ? "完成了任务" : "取消了完成";
            $.post({
                data: { thingId: id, content, type: 2, original: this.value },
                url: "/do/put/thing_log",
            });
        },
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
                await $.post({
                    url: '/do/put/thing_archive', data: data, success: async () => {
                        this.log("归档了任务", null, true);
                        await $.post({ url: "/do/delete/thing", data: { id: value.id } })
                        $.emit("thingUpdate", value, 'remove');
                    }
                })
            })
        },
        async cmd(command) {
            const { value } = this;
            if (command === 'archive') {
                return this.archive()
            }
            if (command === 'delete') {
                return $.confirm('确定删除该任务吗？', async () => {
                    await $.post({ url: "/do/delete/thing", data: { id: value.id } })
                    this.log("删除了任务" + value.title);
                    $.emit("thingUpdate", value, 'remove');
                })
            }
            this.$refs.transfer.show()
        },
        transfer(formData) {
            const { value } = this;
            value.status = 6;
            value.owner = formData.owner;
            $.post({
                url: '/do/patch/thing', data: value, success: () => {
                    $.emit("thingUpdate", value, 'remove');
                    this.log("将任务转交给了：" + $.nick(formData.owner))
                }
            })
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

.a-text {
    color: var(--a-color-white);
}
</style>