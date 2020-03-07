<template>
    <div class="column" :data-id="data.tag">
        <Title :data="data" :columns="columns"/>
        <z-scrollbar :height="-150" :data-id="data.tag">
            <z-draggable :list="data.sons" group="things" @add="begin" @end="end">
                <Thing v-for="item in data.sons" :now="now" :item="item" :key="item._id"/>
            </z-draggable>
            <AddThing :data="data" @changeCategory="addTing"></AddThing>
        </z-scrollbar>
    </div>
</template>
<script>
    import AddThing from "./addThing"
    import ThingsUtil from "../util/things"
    import Thing from "./thing"
    import Title from "./title"

    export default {
        props: ["data", "now", "columns"],
        components: {Thing, AddThing, Title},
        methods: {
            // 拖动到其它框中
            begin: function (evt) {
                if (evt.pullMode) {
                    this.drag(evt);
                }
            },
            // 在同框中拖动完成
            end: function (evt) {
                if (!evt.pullMode && evt.newIndex !== evt.oldIndex) {
                    this.drag(evt);
                }
            },
            drag(evt) {
                let inx = evt.newIndex, things = this.data;
                let currentObj = things.sons[inx];
                let param = {
                    _id: currentObj._id,
                    tag: currentObj.tag
                };
                if (inx === 0) {
                    if (things.sons.length === 1) {
                        param.order = 100000;
                    } else {
                        let nextObj = this.data.sons[inx + 1];
                        param.order = nextObj.order - 500;
                    }
                } else if (inx === things.sons.length) {
                    let pervObj = things.sons[inx - 1];
                    param.order = pervObj.order + 500;
                } else {
                    let nextObj = things.sons[inx + 1];
                    let pervObj = things.sons[inx - 1];
                    param.order = parseInt((nextObj.order + pervObj.order) / 2);
                }
                $.post(param, "/thing/patch.do", function (reback) {
                }, this);
            },
            sort: function (id, status) {
                ThingsUtil.sort(id, status, this.data.sons);
            },
            addTing(data) {
                this.data.sons.unshift(data);
                // 这里保障滚动条也能复位
                // let scroll = this.$refs.scroll;
                // scroll.moveY = 0;
                // scroll.update();
            },
            remove: function () {
                let columns = this.$parent.columns, clm;
                for (let i = 0; i < columns.length; i++) {
                    clm = columns[i];
                    if (clm.tag === this.data.tag) {
                        clm = columns.splice(i, 1)[0];
                        break;
                    }
                }
                this.$parent.save();
                if (clm.sons.length > 0 && columns.length > 0) {
                    $.refresh();// 重新加载页面
                }
            }
        }
    }
</script>