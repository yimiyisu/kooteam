<template>
    <div class="k-todo-item" :class="{'finished':!!item.status,'active':active}">
        <i @click="finish" class="ft icon status hover"></i>
        <div class="content" @click="show">
            <z-avatar v-if="value.owner&&value.owner!=='0'" size="small" :uid="value.owner"></z-avatar>
            {{item.title}}
        </div>
        <div class="right">
            <Owner :value="value"><i class="ft hover icon">&#xe903;</i></Owner>
            <Plan :value="value"/>
            <z-confirm type="text" @click="remove" tip="确定删除吗">
                <i class="ft icon hover remove">&#xe6c2;</i>
            </z-confirm>
        </div>
        <Editor v-model="visible" :todo="item" v-if="visible"/>
    </div>
</template>
<script>
    import Plan from "./plan"
    import Owner from "./owner"
    import Editor from "./editor"

    export default {
        props: ['value', 'index'],
        inject: ["log"],
        components: {Editor, Owner, Plan},
        data() {
            return {
                visible: false,
                item: null,
                active: false
            }
        },
        created() {
            this.item = this.value;
        },
        methods: {
            remove() {
                $.post({_id: this.item._id}, '/thing/remove.do', (reback) => {
                    this.$emit('remove');
                    this.log("移除了子任务:" + this.item.title);
                }, this);
            },
            finish() {
                let status = this.item.status === 0 ? 1 : 0;
                $.post({
                    _id: this.item._id,
                    status: status
                }, '/thing/patch.do', (reback) => {
                    this.item.status = status;
                    let msg = status === 0 ? "取消完成" : "完成了";
                    this.log(msg + "子任务:" + this.item.title);
                }, this);
            },
            show() {
                this.visible = true;
            }
        }
    }
</script>