<template>
    <el-row v-if="loaded" :gutter="24">
        <el-col :span="16">
            <Header :value="item" :readonly="archived" />
            <Describe :value="item" :readonly="archived" />
            <z-block ref="subtask" url="/do/list/thingByParent" v-if="!archived" :params="parent">
                <template #default="list">
                    <SubTodo :list="list" :archived="archived" :value="item" @thingUpdate="update" />
                </template>
            </z-block>
            <Knowlege :value="item" />
            <Watcher :value="item" />
        </el-col>
        <el-col :span="8">
            <Comment :value="item" />
        </el-col>
    </el-row>
</template>
<script>
import Comment from "./blocks/comment";
import Describe from "./blocks/describe";
import Header from "./blocks/header/index.vue";
import Knowlege from './blocks/knowlege/index.vue';
import SubTodo from "./blocks/subTodo/index";
import Watcher from "./blocks/watcher";
export default {
    inject: ["$button"],
    props: {
        data: Object,
    },
    components: {
        Comment,
        Describe,
        Header,
        Watcher,
        SubTodo,
        Knowlege
    },
    data() {
        return {
            loaded: false,
            item: {},
            overtime: false,
            parent: null,
            archived: null,
        };
    },
    //注入
    provide() {
        return {
            // 动态
            thing: Vue.computed(() => this.item),
            // 静态
            close: this.close,
            log: this.log,
        };
    },
    // 异步事件开始之前的准备
    //async await异步更新队列
    async created() {
        await this.load(this.data);
        this.loaded = true;
    },
    methods: {
        //params参数个数
        async load(params) {
            let url = "/do/get/thing";
            let { id, archived } = params;
            this.archived = archived
            this.parent = { parentId: id }
            if (archived) {
                url = "/do/get/thing_archive";
            }
            let result = await $.post({ data: { id: id }, url });
            // 查询归档的待办
            if (!result && !archived) {
                return this.load({ id, archived: true })
            }
            let data = archived ? JSON.parse(result.content) : result;
            !data.end && (data.end = 0);
            this.item = data;
            this.item.archiveId = archived ? id : null;
            let now = new Date();
            now = parseInt(now.getTime() / 1000);
            this.item.overtime =
                data.status === 0 && data.end && data.end < now;
        },
        async log(content, closed) {
            const { item } = this
            await $.post({
                data: { thingId: item.id, content },
                url: "/do/put/thing_log",
            });
            closed && this.$button.close()
        },
        update(params) {
            console.log(params)
            this.$refs.subtask.refresh();
        },
    },
};
</script>
