<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="list" />
        </el-col>
        <el-col :span="23">
            <div>
                详细描述
                <z-icon class="hover" @click="set" :value="editable ? 'xCircle' : 'edit2'" />
                <el-button type="primary" size="small" v-if="editable" @click="change">
                    保存
                </el-button>
            </div>
            <z-editor v-if="editable" v-model="content" height="260px" @save="save" />
            <div v-else @dblclick="set" v-html="value.content || '双击添加描述'" class="article-body mce-content-body" />
        </el-col>
    </el-row>
</template>
<script>
export default {
    name: "detailDescribe",
    props: ["value"],
    data() {
        return {
            editable: false,
            content: "",
        };
    },
    // 当前内容等于传入内容的所有值
    created() {
        this.content = this.value.content;
    },
    methods: {
        // 新建当前这个编辑不等于当前内容
        set() {
            this.editable = !this.editable;
        },
        async save(content) {
            let { id } = this.value;
            let url = "/do/patch/thing";
            await $.post({
                url,
                data: {
                    content,
                    id
                }
            });
            this.value.content = content;
            this.editable = false;
        },
        async change() {
            this.save(this.content)
        },
    },
};
</script>
<style scoped lang="scss">
.a-row {
    margin-top: 16px;
}

.a-button--primary {
    position: absolute;
    right: 6px;
    top: -10px;
}

.article-body {
    min-height: 200px;
    padding: 10px;
}
</style>
