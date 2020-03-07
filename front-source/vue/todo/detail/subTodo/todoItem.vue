<template>
    <div class="k-todo-item" :class="{'finished':!!item.status}">
        <i @click="finish" class="ft icon status hover"></i>
        <span class="content" @click="show">
            {{item.title}}
        </span>
        <z-confirm type="text" @click="remove" tip="确定删除吗">
            <i class="ft icon hover remove">&#xe6c2;</i>
        </z-confirm>
        <Editor v-model="visible" :todo="item" v-if="visible"/>
    </div>
</template>
<script>
    import Editor from "./editor"

    export default {
        data() {
            return {
                visible: false,
                item: {}
            }
        },
        props: ['value'],
        inject: ["log"],
        components: {Editor},
        mounted() {
            this.item = this.value;
        },
        methods: {
            remove() {
                $.post({id: this.item._id}, '/thing/removeThing.do', (reback) => {
                    this.$emit('removeThing', this.index);
                    this.log("移除了任务上的清单 " + this.item.title);
                });
            },
            finish() {
                let status = this.item.status === 0 ? 1 : 0;
                $.post({
                        _id: this.item._id,
                        status: status
                    }, '/patch/childThing.json', (reback) => {
                        this.item.status = status;
                        this.log("完成了任务上的 " + this.item.title);
                    }, this
                );
            },
            show() {
                this.visible = true;
            }
        }
    }
</script>