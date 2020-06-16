<template>
    <div class="header">
        <div class="h4">
            {{column.title}}
            <z-popover placement="bottom-end" popper-class="z-project-pop" width="50" trigger="click">
                <span class="ft hover" @click="visible=true">重命名</span>
                <z-confirm class="ft hover" tip="确定删除面板吗" @click="remove">删除</z-confirm>
                <i class="ft icon" slot="reference">&#xe737;</i>
            </z-popover>
            <z-dialog v-if="visible" width="30%" title="修改名称">
                <z-input type="text" maxlength="30" v-model="title"></z-input>
                <span slot="footer" class="dialog-footer">
                  <z-button @click="visible = false">取 消</z-button>
                  <z-button type="primary" @click="updateTitle">确 定</z-button>
                </span>
            </z-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["column"],
        data() {
            return {
                visible: false,
                title: ''
            }
        },
        created() {
            this.title = this.column.title
        },
        methods: {
            remove() {
                if (this.column.sons.length !== 0) {
                    return $.notice("面板中还存在完成任务，不能删除", 'error');
                }
                $.emit("boardRemove", this.column.tag);
            },
            updateTitle() {
                $.emit("boardUpdate", this.title, this.column.tag);
                this.column.title = this.title;
                this.visible = false;
            }
        }
    }
</script>