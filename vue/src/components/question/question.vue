<template>
    <div>
        <!-- 单选和多选题的选项区域 -->
        <div v-if="showOptions">
            <el-button type="primary" size="small" @click="addOption">
                <i class="el-icon-plus"></i> 添加选项
            </el-button>

            <div class="options-list">
                <el-row :gutter="12" v-for="(option, index) in value.options" :key="option.id" class="option-row">
                    <el-col :span="12">
                        <el-input v-model="option.label" placeholder="选项内容" @change="emitUpdate"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-input-number v-model="option.score" :min="0" :max="100" controls-position="right"
                            @change="emitUpdate"></el-input-number>
                    </el-col>
                    <el-col :span="4" class="remove-col">
                        <z-icon value="x" @click="removeOption(index)" />
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuestionOptions',
    props: {
        value: {
            type: Object,
            required: true,
            default: () => ({
                type: 1,
                options: []
            })
        }
    },
    computed: {
        showOptions() {
            return this.value.type === 1 || this.value.type === 3;
        }
    },
    methods: {
        addOption() {
            if (!this.value.options) {
                this.value.options = [];
            }
            this.value.options.push({
                id: this.generateId(),
                label: '',
                score: 0
            });
            this.emitUpdate();
        },
        removeOption(index) {
            this.value.options.splice(index, 1);
            this.emitUpdate();
        },
        generateId() {
            return Math.random().toString(36).substr(2, 9);
        },
        emitUpdate() {
            this.$emit('input', { ...this.value });
        }
    },
    mounted() {
        // 初始化选项
        if (this.showOptions && (!this.value.options || this.value.options.length === 0)) {
            this.addOption();
        }
    }
};
</script>

<style scoped>
.option-row {
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.remove-col {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    /* 与输入框高度保持一致 */
}
</style>