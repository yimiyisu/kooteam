<template>
    <z-row class="z-row k-todo-list">
        <z-col :span="1"><span class="ft icon h2">&#xe819;</span></z-col>
        <z-col :span="23">
            <div class="title"><strong>子任务列表</strong>
                <!--<z-dropdown @command="cmd" class="right">-->
                <!--<var command="hide">隐藏完成的项目</var>-->
                <!--<var command="delete">删除</var>-->
                <!--</z-dropdown>-->
                <z-button class="right" size="mini" type="primary" @click="add">添加子任务</z-button>
            </div>
            <z-progress v-if="list&&list.length>0" :percentage="percent" color="#67c23a"></z-progress>
            <div v-else class="empty">暂无子任务</div>
            <TodoItem v-for="item in list" :value="item" :key="item._id"/>
            <Editor v-if="visible" :list="list" v-model="visible"/>
        </z-col>
    </z-row>
</template>
<script>
    import TodoItem from './todoItem';
    import Editor from "./editor"

    export default {
        data() {
            return {
                visible: false,
                list: [],
            }
        },
        components: {TodoItem, Editor},
        props: ["value"],
        mounted() {
            this.getList();
        },
        computed: {
            percent() {
                let length = this.list.length, number = 0;
                this.list.forEach((item) => item.status && number++);
                if (length === 0) {
                    return 0;
                }
                number = parseInt((number / length) * 100);
                return number;
            }
        },
        methods: {
            cmd(command) {
                debugger
            },
            getList() {
                $.post({parentId: this.value._id}, "/mix/thingList.json", (reback) => {
                    this.list = reback.data;
                });
            },
            add() {
                this.visible = true;
            },
            remove(inx) {
                this.list.splice(inx, 1);
            }
        }
    }
</script>