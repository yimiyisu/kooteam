<template>
    <z-popover v-model="visible">
        <z-input label="标题" name="title" v-model="title" style="width: 360px;" placeholder="请输入标题"></z-input>
        <div class="operator">
            <z-button plain size="mini" @click="close">取消</z-button>
            <z-button size="mini" type="primary" @click="submit">添加</z-button>
        </div>
        <div slot="reference" class="btn">
            <i class="ft icon">&#xe6f1;</i>子任务
        </div>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                thing: null,
                visible: false,
                title: ''
            }
        },
        inject: ["getThing", "log"],
        created() {
            this.thing = this.getThing();
        },
        methods: {
            close() {
                this.visible = false;
            },
            submit() {
                if (this.title === '') {
                    return $.notice("清单标题不能为空", "error");
                }
                $.post({
                    title: this.title,
                    parentId: this.thing._id,
                    status: 0
                }, "/put/childThing.json", (reback) => {
                    this.visible = false;
                    $.emit("todo_getData", null);
                    this.log("为这个任务添加了待办清单 " + this.title);
                });
            }
        }
    }
</script>