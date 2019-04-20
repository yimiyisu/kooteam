<template>
    <div class="k-flow" tabindex="-1">
        <div class="canvas" style="width: 1800px;height: 1800px">
        </div>
        <Editor></Editor>
        <Toolbar></Toolbar>
    </div>
</template>
<script>
    import Render from "./render"
    import Node from "./component/node"
    import PointEvent from "./event/point"
    import Line from "./component/line"
    import Editor from "./editor"
    import Toolbar from "./toolbar"
    import Patch from "./util/patchAndQuery"
    import MouseEvent from "./event/mouse"
    import DrawLine from "./component/drawLine"

    export default {
        props: ["value"],
        data: function () {
            return {
                nodes: null,
                lines: null,
                cuurentNode: null, // 当前选中的节点
                point: null,// 动态复制的热点
                tempPath: null,// 动态线条路径
                canvas: null,
                r: null,
                tempNodes: [],  // 用于保存更新后的节点信息
                tempLines: [],  // 用于保存更新后的线条信息
                currentTargetId: "",
                hideItem: [],
                data: {nodes: [], lines: [], drawLines: []},
                docId: null,
                isDrawLine: false,// 是否开始绘制线条
                mouserOverTarget: null, // 鼠标覆盖的图形id
                drawLine: {},
                drawLineStart: null,
                drawLineEnd: null,
            }
        },
        components: {Editor, Toolbar},
        mounted: function () {
            // this.docId = $.getParam("docId");
            // $.http({_id: this.docId}, "/extend/note.json", function (reback) {
            //     if (reback.data) {
            //         let content = reback.data.content;
            //         if (content !== null && content !== "" && content !== undefined) {
            //             this.data = JSON.parse(reback.data.content);
            //         }
            //     }
            // }, this);
            $.lib(["/raphael.min.js"], this.init);

        },
        methods: {
            init: function () {
                window.flowVue = this;
                // 注册节点与连线
                if (!Raphael.fn.flowLine) {
                    Line();
                    Node();
                    DrawLine();
                    $(window).keydown(function (e) {
                        let code = e.keyCode;
                        if (code === 8) {
                            let id = window.flowVue.currentTargetId;
                            Render.remove(id);
                        }
                    })
                }
                let contentDom = $(".canvas", this.$el);
                this.r = Raphael(contentDom[0], 1800, 1800);
                Render.init(this.data, this.r);
                contentDom.droppable({
                    accept: ".shape",
                    drop: function (event, ui) {
                        let offset = ui.offset, type = ui.helper.data("name");
                        Render.addNode(offset.left, offset.top - 60, type);
                    }
                });

                // this.canvas = contentDom.draggable();

                contentDom.click(function (e) {
                    let target = e.target.tagName;
                    let cuurentNode = window.flowVue.currentNode;
                    if (target === "svg" && cuurentNode) {
                        PointEvent.hide();
                        $.emit("editFlowCancel");
                    }
                    if (target === "svg") {
                        window.flowVue.currentTargetId = "";
                        window.flowVue.currentTargetTextId = "";
                        $.emit("editFlowCancel");
                    }
                });
                contentDom.mousedown(MouseEvent.mousedown);
                contentDom.mousemove(MouseEvent.mousemove);
                contentDom.mouseup(MouseEvent.mouseup)
            }, save: function (option) {
                this.data = Patch.patchData();
                let params = {
                    _id: this.docId,
                    content: JSON.stringify(this.data),
                };
                if (option === "render") { // 当改变节点的长宽时，全部重新刷新，其余的已经局部刷新
                    Render.init(this.data, this.r);
                }
                // $.http(params, "/note/patch.do", function () {
                // }, this);
            }
        }
    }
</script>