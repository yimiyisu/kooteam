<template>
    <div class="column J_data" :data-id="data.tag">
        <Title :column="data"/>
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
    import ThingsUtil from "../../util/things"
    import Thing from "./thing"
    import Title from "./title"

    export default {
        props: ["data", "now"],
        components: {Thing, AddThing, Title},
        inject: ['getColumn'],
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
                let inx = evt.newIndex,
                    things = this.data,
                    pervObj, nextObj,
                    currentObj = things.sons[inx];
                let param = {
                    _id: currentObj._id,
                    tag: this.data.tag
                };
                if (inx === 0) {
                    if (things.sons.length === 1) {
                        param.order = 100000;
                    } else {
                        nextObj = this.data.sons[inx + 1];
                        param.order = nextObj.order - 500;
                    }
                } else if (inx === things.sons.length) {
                    pervObj = things.sons[inx - 1];
                    param.order = pervObj.order + 500;
                } else {
                    let nextObj = things.sons[inx + 1],
                        pervObj = things.sons[inx - 1];
                    if (nextObj) {
                        param.order = parseInt((nextObj.order + pervObj.order) / 2);
                    } else {
                        param.order = pervObj.order + 1;
                    }
                }
                $.post(param, "/thing/patch.do", function (reback) {
                    let column = this.getColumn(param.tag);
                    $.post({
                        thingId: param._id,
                        content: "把任务移入到:" + column.title
                    }, '/put/thingLog.json');
                }, this);
            },
            sort: function (id, status) {
                ThingsUtil.sort(id, status, this.data.sons);
            },
            addTing(data) {
                this.data.sons.unshift(data);
            }
        }
    }
</script>