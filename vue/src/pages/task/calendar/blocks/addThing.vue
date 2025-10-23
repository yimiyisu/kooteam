<template>
    <div class="add">
        <el-input v-model="title" ref="input" autosize type="textarea" :rows="4" placeholder="请输入要处理的事项" @keydown.stop="keydown" />
        <div class="z-form-action prority">
            <div class="dict">
                <z-dict code="quadrantType" v-model="quadrant" />
            </div>
            <div class="op">
                <el-button size="small" type="primary" @click="save">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data: function () {
        return {
            title: "",
            quadrant: 2
        };
    },
    mounted() {
        this.$refs['input'].focus()
    },
    methods: {
        keydown(event) {
            event.stopPropagation();
            if (event.key === 'Enter') {
                event.preventDefault();
                this.save();
                return this.title = "";
            }
        },
        async save() {
            const { title, quadrant } = this
            if (!title) {
                return $.error("任务内容不能为空");
            }
            this.$emit("update", { title, quadrant })
        },
    },
};
</script>
<style scoped lang="scss">
.prority {
    bottom: 10px;
    left: 18px;
    display: flex;
}

.dict {
    flex: 1;
    text-align: left;
}

.op {
    width: 120px;
    text-align: right;
}
</style>