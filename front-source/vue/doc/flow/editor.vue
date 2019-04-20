<template>
    <div class="k-grap-editor" v-if="isShow" :style="style">
        <textarea @keydown.stop="keydown" @blur="save" v-model="title"></textarea>
        <div class="theme" v-if="isNode" @click="colorClick" :style="{'background':color}"></div>
        <div class="colors" v-show="isColor">
            <span v-for="(cl,idx) in colors" :key="idx"
                  @click="select(cl)" :class="{'active':cl===color}" :style="{'background':cl}"></span>
        </div>
    </div>
</template>
<script>
    import Colors from "../../util/colors"
    import Config from "./util/config"

    const minWidth = 100, minHeight = 60;
    export default {
        data: function () {
            return {
                isShow: false,
                isColor: false,
                isNode: true,
                id: "",
                title: "",
                color: Colors[0],
                colors: [],
                style: ""
            }
        },
        mounted: function () {
            let that = this;
            that.colors = Colors;
            that.$parent.$on("showEditor", function (status, node) {
                that.init(status, node);
            });
        },
        methods: {
            init: function (status, node) {
                if (!status) {
                    if (!this.isShow) {
                        return;
                    }
                    this.style = Config.hideStyle;
                    return this.isShow = false;
                }
                this.isShow = true;
                this.id = node.data("id");
                let context = this.$parent, bbox = node.getBBox(), item, width, height, x, y;
                // 当为线条时，弹出框
                if (this.id.indexOf("-") > -1) {
                    this.isNode = false;
                    item = getLine(this.id, context);
                    width = minWidth;
                    height = minHeight;
                    y = bbox.y + (bbox.height - height) / 2;
                    x = bbox.x + (bbox.width - width) / 2;
                } else {
                    this.isNode = true;
                    item = context.getNode(this.id);
                    width = bbox.width < minWidth ? minWidth : bbox.width;
                    height = bbox.height < minHeight ? minHeight : bbox.height;
                    width += 20;
                    height += 20;
                    x = bbox.x - 10;
                    y = bbox.y - 10;
                }

                this.title = item.text;
                this.style = "left:" + x + "px;top:" + y + "px;width:" + width + "px;height:" + height + "px";
                let area = $("textarea", this.$el);
                this.$nextTick(function () {
                    area.focus();
                });
            },
            save: function () {
                if (!this.title) {
                    return;
                }
                let context = this.$parent;
                if (this.isNode) {
                    let node = context.getNode(this.id);
                    node.text = this.title;
                    // 刷新节点
                    context.r.flowNode(node, context.nodes[this.id]);
                } else {
                    let line = getLine(this.id, context);
                    if (!line) {
                        return;
                    }
                    line.text = this.title;
                    // 刷新线条
                    context.r.flowLine({
                        from: context.nodes[line.start],
                        to: context.nodes[line.end],
                        text: line.text
                    }, context.lines[this.id]);
                }
                context.save();
                context.emitEditor(false);
            },
            keydown: function (e) {
                let code = e.keyCode;
                // 退出
                if (code === 27) {
                    return this.$parent.emitEditor(false);
                }
                // enter键添加同级
                if (code === 13) {
                    if (e.ctrlKey || e.metaKey) {// 组合键，算子级
                        this.save();
                    }
                }
            },
            colorClick: function () {
                this.isColor = !this.isColor;
            },
            select: function (cl) {
                if (cl === this.color) {
                    return;
                }
                this.color = cl;
                let context = this.$parent,
                    node = context.nodes[this.id],
                    item = context.getNode(this.id);
                node.attr({fill: cl, stroke: cl});
                item.color = cl;
                this.isColor = false;
                context.save();
                context.emitEditor(false);
            }
        }
    }

    function getLine(id, context) {
        let ids = id.split("-"), lines = context.data.lines, line;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line.start === ids[0] && line.end === ids[1]) {
                return line;
            }
        }
        return null;
    }
</script>