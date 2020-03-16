<template>
    <z-draggable :list="value" group="item" @end="end">
        <div class="group" v-for="item in value" :key="item.id">
            <div class="guide" :data-id="item.id"></div>
            <div class="item" :data-id="item.id">
                <hr/>
                <div class="header">
                    <Icon :value="item"></Icon>
                    <div v-if="item.link" @click="view(item)" class="title">
                        {{item.title}}
                    </div>
                    <AddDoc v-else class="title" :item="item">{{item.title}}</AddDoc>
                </div>
                <div v-if="readonly" class="info">
                    {{item.link|idate}}
                </div>
                <div v-else class="info">
                    <ChangeTitle :value="item" class="ft icon hover">&#xe88e;</ChangeTitle>
                    <AddDoc class="ft icon hover" :parent="item" title="添加子章节">&#xe8c8;</AddDoc>
                    <z-confirm class="ft icon hover" type="text" tip="确定删除文档吗" @click="trigger(item,'remove')">
                        &#xe8f8;
                    </z-confirm>
                </div>
            </div>
            <Chapter :key="'s'+item.id" v-if="item.status!==false&&item.sons&&item.sons.length>0"
                     :readonly="readonly" :value="item.sons"></Chapter>
        </div>
    </z-draggable>
</template>
<script>
    import Icon from "./icon"
    import AddDoc from "./addDoc";
    import ChangeTitle from "./changeTitle"

    export default {
        name: "Chapter",
        props: ["value", "readonly", "parent"],
        components: {Icon, ChangeTitle, AddDoc},
        data: function () {
            return {
                title: "",
                current: null
            }
        },
        methods: {
            end(evt) {
                if (evt.newIndex === evt.oldIndex) {
                    return;
                }
                this.trigger(null, "save");
                // $.post(this.data, "/note/patch.do", function (reback) {
                // }, this);
            },
            view: function (item) {
                if (item.link === "folder") {
                    return item.status = !item.status;
                }
                // 变更状态
                if (item.link === "folder") {
                    item.status = !item.status;
                    return this.trigger(item.id, 'folder');
                }
                this.trigger(item.link, 'doc');
            },
            fold: function (item) {
                item.status = !item.status;
            },
            trigger: function (item, evt) {
                let param = {
                    event: evt,
                    data: item
                };
                $.emit("chapterEvt", param);
            }
        }
    }
</script>