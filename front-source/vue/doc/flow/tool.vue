<template>
    <div class="tool" :style="style" @click.right.prevent.stop="right" @dblclick="dblclick">
        <!--连线节点-->
        <div class="l1 line"></div>
        <div class="l2 line"></div>
        <div class="l3 line"></div>
        <div class="l4 line"></div>
        <div class="op" v-show="showOp">
            <span @click="op('edit')">编辑</span>
            <span @click="op('remove')">删除</span>
        </div>
    </div>
</template>
<script>
    import Move from "./event/move"
    import Resize from "./event/resize"
    import AddLine from "./event/addLine"
    import Crub from "./util/crub"
    import Config from "./util/config"

    export default {
        data: function () {
            return {
                isShow: false,
                startPoint: null,
                showOp: false,
                style: ""
            }
        },
        mounted: function () {
            let that = this;
            that.$parent.$on("showTool", function (status, node) {
                that.init(status, node);
            });
            // 新增连线
            $(".line", this.$el).draggable({
                helper: "clone",
                start: function (event, ui) {
                    that.addLineStart(ui);
                },
                drag: function (event, ui) {
                    that.addLinedrag(ui);
                },
                stop: function (event, ui) {
                    that.addLineDragFinish(ui);
                }
            });
            // 拖动节点
            $(this.$el).draggable({
                // grid: [4, 4],
                drag: function (event, ui) {
                    that.nodeDrag(ui);
                },
                stop: function () {
                    that.nodeDragFinish();
                }
            });
            // 调整节点大小
            $(this.$el).resizable({
                handles: "all",
                minHeight: 48,
                minWidth: 48,
                autoHide: true,
                resize: function (event, ui) {
                    that.resize(ui);
                },
                stop: function () {
                    that.resizeFinish();
                }
            });
        },
        methods: {
            addLineStart: function (ui) {
                AddLine.start(ui, this.$parent);
            },
            addLinedrag: function (ui) {
                let context = this.$parent;
                context.isDrawLine = true;
                AddLine.moving(ui, context);
            },
            addLineDragFinish: function (ui) {
                let context = this.$parent;
                AddLine.finish(ui, context);
                context.isDrawLine = false;
            },
            nodeDrag: function (ui) {
                Move.moving(ui, this.$parent);
            },
            nodeDragFinish: function () {
                Move.finish(this.$parent);
            },
            resize: function (ui) {
                Resize.moving(ui, this.$parent);
            },
            resizeFinish: function () {
                Resize.finish(this.$parent);
            },
            dblclick: function () {
                let context = this.$parent;
                return context.emitEditor(true, context.currentNode);
            },
            right: function () {
                this.showOp = true;
            },
            op: function (type) {
                this.showOp = false;
                let context = this.$parent;
                if (type === "remove") {
                    return Crub.remove(context);
                }
                if (type === "edit") {
                    return this.dblclick();
                }
            },
            init: function (status, node) {
                if (!status) {
                    if (!this.isShow) {
                        return;
                    }
                    this.style = Config.hideStyle;
                    return this.isShow = false;
                }
                this.showOp = false;
                this.isShow = true;
                let bbox = node.getBBox();
                this.style = "left:" + bbox.x + "px;top:" + bbox.y + "px;width:" + bbox.width + "px;height:" + bbox.height + "px";
            }
        }
    }
</script>