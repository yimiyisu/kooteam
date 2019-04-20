<template>
    <div class="k-grap-editor" v-if="isShow" @click="click" :style="style">
        <textarea @keydown="keyup" @blur="save" v-model="title"></textarea>
        <div class="theme" @click="colorClick" :style="{'background':color}"></div>
        <div class="colors" v-show="isColor">
            <span v-for="(cl,idx) in colors" :key="idx"
                  @click="select(cl)" :class="{'active':cl===color}" :style="{'background':cl}">
            </span>
        </div>
    </div>
</template>
<script>
    import Colors from "../../util/colors"
    import Query from "./util/query"
    import Config from "./util/config"

    export default {
        props: ["current"],
        data: function () {
            return {
                isShow: false,
                isColor: false,
                node: null,
                title: null,
                color: Colors[0],
                colors: [],
                style: "",
                txt: "",
                id: ""
            }
        },
        mounted: function () {
            let that = this;
            this.colors = Colors;
            let context = this.$parent;
            context.$on("showEditor", function (status, node) {
                that.init(status, node);
            });
        },
        methods: {
            init: function (status, node) {
                if (!status) {
                    if (this.isShow === false) {
                        return;
                    }
                    this.isShow = false;
                    return this.style = Config.hideStyle;
                }
                this.isShow = true;
                this.id = node.id;
                this.isColor = false;
                let offset = 30, context = this.$parent;
                let x = node.attrs.x - offset,
                    y = node.attrs.y - offset,
                    width = node.getBBox().width + offset * 2,
                    height = node.getBBox().height + offset * 2;
                if (width < 150) {
                    width = 150;
                }
                if (height < 110) {
                    height = 110;
                }
                this.style = "top:" + y + "px;left:" + x + "px;width:" + width + "px;height:" + height + "px";
                this.txt = context.paper.getById("t_" + node.id);
                this.title = this.txt.attrs.text;
                this.$nextTick(function () {
                    let area = $("textarea");
                    area.el[0].focus();
                });
            },
            keyup: function (e) {
                e.stopPropagation();
                let keycode = e.keyCode, context = this.$parent;
                if (keycode === 27) {
                    return context.emitEditor(false);
                }
                if (keycode === 13) {
                    return this.save();
                }
            },
            save: function () {
                let context = this.$parent;
                if (this.txt.attrs.text !== this.title) {
                    let node = Query.queryNodeById(this.id, context.data);
                    if (!node) {
                        return;
                    }
                    node.name = this.title;
                    context.save();
                }
                context.emitEditor(false);
            },
            colorClick: function () {
                this.isColor = !this.isColor;
            },
            select: function (cl) {
                if (this.color === cl) {
                    return;
                }
                this.color = cl;
                let context = this.$parent, node = Query.queryNodeById(this.id, context.data);
                node.color = cl;
                context.save();
            },
            click: function (evt) {
                evt.stopPropagation();
            }
        }
    }
</script>