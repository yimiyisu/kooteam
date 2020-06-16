<template>
    <div class="column k-column-add">
        <div class="trigger ft hover" @click="toggle">
            <i class="ft icon">&#xe8c8;</i>添加一个新列表
        </div>
        <div class="wrap" v-if="isAdd">
            <z-input @keyup.esc="toggle" maxlength="30" v-model="title" placeholder="请输入要处理的事项"/>
            <div class="prority">
                <z-button size="mini" type="primary" @click="save">保存</z-button>
                <z-button size="mini" @click="toggle">取消</z-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                isAdd: false,
                title: ""
            }
        },
        methods: {
            toggle() {
                this.isAdd = !this.isAdd;
            },
            save() {
                if (!this.title) {
                    return $.notice("标题不能为空", "error");
                }
                $.emit("boardUpdate", this.title);
                this.toggle();
                this.title = "";
            }
        }
    }
</script>