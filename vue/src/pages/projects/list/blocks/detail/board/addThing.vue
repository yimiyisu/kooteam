<template>
    <div class="add">
        <el-input v-model="title" ref="input" type="textarea" :rows="4" placeholder="请输入要处理的事项" @keydown.stop="keyup" />
        <div class="prority">
            <div class="dict">
                <z-dict code="quadrantType" v-model="quadrant" />
            </div>
            <div class="op">
                <el-button size="small" type="primary" @click="save">
                    保存
                </el-button>
                <el-button link size="small" @click="close">
                    <z-icon value="x" />
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
        close() {
            this.$emit("close")
        },
        keyup(event) {
            event.stopPropagation();
            let code = event.keyCode;
            if (code === 13) {
                this.save();
                return this.title = "";
            }
            if (code === 27) {
                return this.close();
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
    margin-top: 10px;
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