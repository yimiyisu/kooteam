<template>
    <div class="add">
        <div class="wrap">
            <div v-if="isEdit">
                <input v-model="title" maxlength="12" @keyup="keyup" type="text"/>
                <div class="btn">
                    <z-button size="mini" @click="cancel">取消</z-button>
                    <z-button size="mini" plain type="primary" @click="save">保存</z-button>
                </div>
            </div>
            <div v-else class="tip" @click="focus"><i class="z-icon">&#xe145;</i>新建任务</div>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                title: "",
                isEdit: false
            }
        },
        methods: {
            focus: function () {
                this.isEdit = true;
            },
            cancel: function () {
                this.isEdit = false;
            },
            keyup: function (event) {
                let keycode = event.keyCode;
                if (keycode === 27) {
                    return this.cancel();
                }
                if (keycode === 13) {
                    this.save();
                }
            },
            save: function () {
                if (!this.title) {
                    return alert("名称不能为空");
                }
                let parent = this.$parent;
                parent.rndId++;
                // 新增列
                let board = {
                    title: this.title,
                    tag: "t" + parent.rndId,
                    sons: []
                };
                parent.columns.push(board);
                this.title = "";
                this.cancel();
                parent.save();
            },
        }
    }
</script>