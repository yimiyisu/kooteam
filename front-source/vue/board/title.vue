<template>
    <div class="header">
        <div class="h4">
            {{title}}
            <z-popover placement="bottom-end" popper-class="z-project-pop" width="50" trigger="click">
                <span class="ft hover" @click="visible=true">重命名</span>
                <z-confirm class="ft hover" tip="确定删除面板吗" @click="remove">删除</z-confirm>
                <i class="ft icon" slot="reference">&#xe737;</i>
            </z-popover>
            <z-dialog v-if="visible" width="30%" title="修改名称">
                <z-input type="text" v-model="title"></z-input>
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
        props: ["data", "columns"],
        data() {
            return {
                visible: false,
                title: ''
            }
        },
        mounted() {
            this.title = this.data.title
        },
        methods: {
            remove() {
                if (this.data.sons.length !== 0) {
                    return $.notice("还有待完成的任务，不能删除", 'error');
                }
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.columns[i].tag === this.data.tag) {
                        this.columns.splice(i, 1);
                    }
                }
                let param = {
                    _id: $.getParam("id"),
                    board: JSON.stringify(this.columns),
                };
                $.post(param, "/patch/project.json", function () {
                    $.refresh();
                }, this);
            },
            updateTitle(evt) {
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.columns[i].tag === this.data.tag) {
                        this.columns[i].title = this.title;
                        break;
                    }
                }
                let param = {
                    _id: $.getParam("id"),
                    board: JSON.stringify(this.columns),
                };
                $.post(param, "/patch/project.json", function () {
                }, this);
                this.visible = false;
            }
        }
    }
</script>