<template>
    <z-col :span="12" :class="data.tag">
        <Title :quadrant="data.tag" @finish="unshift" :name="data.title"></Title>
        <z-scrollbar class="block" :height="height" :data-id="data.tag">
            <!--<div class="block" :data-id="data.tag">-->
            <z-draggable :list="data.sons" group="things" @add="add" @end="end">
                <Thing v-for="item in data.sons" :data="item" :now="now" :key="item._id"></Thing>
            </z-draggable>
            <div v-if="!data.sons||data.sons.length===0" class="empty">恭喜你！已完成了所有待办</div>
            <!--</div>-->
        </z-scrollbar>
    </z-col>
</template>
<script>
    import Title from "./title"
    import Thing from "./thing"
    import ThingsUtil from "../util/things"

    export default {
        props: ["data", "now", "height"],
        components: {Title, Thing},
        data: function () {
            return {
                currentId: ""
            }
        },
        methods: {
            // 拖动到其它框中
            add: function (evt) {
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
                let inx = evt.newIndex;
                let currentObj = this.data.sons[inx];
                let param = {
                    _id: currentObj._id,
                    quadrant: this.data.tag,
                };
                if (inx === 0) {
                    if (this.data.sons.length === 1) {
                        param.order = 100000;
                    } else {
                        let nextObj = this.data.sons[inx + 1];
                        param.order = nextObj.order - 500;
                    }
                } else if (inx === this.data.length) {
                    let pervObj = this.data.sons[inx - 1];
                    param.order = pervObj.order + 500;
                } else {
                    let nextObj = this.data.sons[inx + 1];
                    let pervObj = this.data.sons[inx - 1];
                    param.order = parseInt((nextObj.order + pervObj.order) / 2);
                }

                $.post(param, "/thing/patch.do", function (reback) {
                }, this);
            },
            unshift(item) {
                this.data.sons.unshift(item);
            },
            sort: function (id, status) {
                ThingsUtil.sort(id, status, this.data.sons);
            }
        }
    }
</script>