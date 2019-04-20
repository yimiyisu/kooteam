<template>
    <div class="column" :data-id="things.tag">
        <div class="header">
            <AddThing v-if="isAddThing" :data="things" @changeCategory="addTing"></AddThing>
            <div class="h4">
                <input v-if="isEdit" @blur="rename" maxlength="12" @keyup="keyup" type="text" :value="things.title"/>
                <div v-else>
                    {{things.title}}
                    <i class="z-icon hover plus" @click="add">&#xe148;</i>
                </div>
                <i class="z-icon hover do" v-show="!isEdit" @click="focus">&#xe313;</i>
                <div class="action" tabindex="-1" @blur="blur" v-if="showAction">
                    <span @click="renameClk">重命名</span>
                    <!--<span @click="remove">删除</span>-->
                    <z-confirm tip="确定删除吗" @click="remove">删除</z-confirm>
                </div>
            </div>
        </div>
        <div class="things" :data-id="things.tag">
            <z-draggable :list="things.sons" group="things" @add="begin" @end="end">
                <Thing v-for="item in things.sons" :data="item" :now="now" drag="board" :key="item._id"></Thing>
            </z-draggable>
            <div v-if="!things.sons||things.sons.length===0" class="empty">暂无待办事项</div>
        </div>
    </div>
</template>
<script>
    import Thing from "../todo/thing"
    import AddThing from "./addThing"
    import ThingsUtil from "../util/things"

    export default {
        props: ["data", "now"],
        components: {Thing, AddThing},
        data: function () {
            return {
                things: {},
                currentId: "",
                title: "",
                isAddThing: false,
                isEdit: false,
                showAction: false
            }
        },
        mounted: function () {
            this.things = this.data;
        },
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
                let inx = evt.newIndex;
                let currentObj = this.things.sons[inx];
                let param = {
                    _id: currentObj._id,
                    tag: currentObj.tag
                };
                if (inx === 0) {
                    if (this.things.sons.length === 1) {
                        param.order = 100000;
                    } else {
                        let nextObj = this.things.sons[inx + 1];
                        param.order = nextObj.order - 500;
                    }
                } else if (inx === this.things.sons.length) {
                    let pervObj = this.things.sons[inx - 1];
                    param.order = pervObj.order + 500;
                } else {
                    let nextObj = this.things.sons[inx + 1];
                    let pervObj = this.things.sons[inx - 1];
                    param.order = parseInt((nextObj.order + pervObj.order) / 2);
                }
                $.http(param, "/thing/patch.do", function (reback) {
                }, this);
            },
            blur: function () {
                this.showAction = false;
            },
            add: function () {
                this.isAddThing = true;
                this.$nextTick(function () {
                    $("textarea", this.$el).el[0].focus();
                });
            },
            focus: function () {
                this.showAction = true;
                this.$nextTick(function () {
                    $(".action", this.$el).el[0].focus();
                });
            },
            renameClk: function () {
                this.isEdit = true;
                this.$nextTick(function () {
                    $("input", this.$el).focus();
                });
            },
            keyup: function (e) {
                let keycode = e.keyCode;
                if (keycode === 27) {
                    return this.blur();
                }
                if (keycode === 13) {
                    this.rename(e);
                }
            },
            rename: function (evt) {
                let val = $(evt.currentTarget).val(), columns = this.$parent.columns;
                if (!val) {
                    return;
                }
                this.isEdit = false;
                if (val === this.things.title) {
                    return;
                }
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].tag === this.things.tag) {
                        columns[i].title = val;
                    }
                }
                this.$parent.save();
            },
            sort: function (id, status) {
                ThingsUtil.sort(id, status, this.things.sons);
            },
            addTing(data) {
                this.things.sons.unshift(data);
            },
            remove: function () {
                let columns = this.$parent.columns, clm;
                for (let i = 0; i < columns.length; i++) {
                    clm = columns[i];
                    if (clm.tag === this.things.tag) {
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