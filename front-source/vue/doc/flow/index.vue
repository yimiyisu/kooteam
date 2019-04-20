<template>
    <div class="k-flow" tabindex="-1">
        <div class="canvas" style="width: 18000px;height: 18000px">
            <Tool></Tool>
            <Editor></Editor>
        </div>
        <Sidebar :class="{'show':!readonly}"></Sidebar>
    </div>
</template>
<script>
    import Render from "./render"
    import Node from "./component/node"
    import Line from "./component/line"
    import Editor from "./editor"
    import Sidebar from "./sidebar"
    import Listener from "./util/listener"
    import Config from "./util/config"
    import Tool from "./tool"
    import Center from "../../util/center"

    export default {
        props: ["value", "readonly", "emitSave"],
        data: function () {
            return {
                nodes: {},// svg的节点缓存
                lines: {},// svg的线条缓存
                line: null,// 当前选中的线条
                cuurentNode: null, // 当前选中的节点
                tempPath: null,// 动态线条路径
                isDrawLine: false,
                r: null,// 画布对象
                data: {
                    nodes: [],
                    lines: [],
                    ids: 1
                }
            }
        },
        components: {Editor, Sidebar, Tool},
        watch: {
            value: function () {
                this.init();
            },
            emitSave: function (val) {
                if (!val) {
                    return;
                }
                this.save();
            }
        },
        mounted: function () {
            $.lib(["/raphael.min.js"], this.init);
            let contentDom = $(".canvas", this.$el);
            contentDom.draggable();
            contentDom.droppable({
                accept: ".shape",
                drop: function (event, ui) {
                    let offset = ui.offset,
                        type = ui.helper.data("name"),
                        position = $(this).offset();
                    let node = {
                        x: offset.left - position.left,
                        y: offset.top - 30 - position.top,
                        type: type
                    };
                    // node.x -= node.x % 4;
                    // node.y -= node.y % 4;
                    Listener.addNode(node);
                }
            });
        },
        methods: {
            init: function () {
                let content = this.value.content;
                if (content) {
                    this.data = JSON.parse(content);
                }
                Listener.init(this);
                // 注册节点与连线
                if (!Raphael.fn.flowLine) {
                    Line();
                    Node();
                    Listener.keydown();
                }
                let contentDom = $(".canvas", this.$el);
                if (this.r) {
                    this.r.clear();
                }
                this.r = Raphael(contentDom[0], Config.cavasSize, Config.cavasSize);
                Render.init(this.data, this.r, this);
                Center(contentDom);
            },
            emitEditor: function (status, target) {
                this.$emit("showEditor", status, target);
            },
            emitTool: function (status) {
                this.$emit("showTool", status, this.currentNode);
            },
            // 重新渲染相关线条
            rerenderLines: function (pointId) {
                let lines = this.data.lines, result = [], line, current;
                for (let i = 0; i < lines.length; i++) {
                    current = lines[i];
                    if (current.start === pointId || current.end === pointId) {
                        // 从缓存中，找到svg线
                        result.push(current);
                    }
                }
                if (lines.length === 0) {
                    return;
                }
                let fromNode, toNode, lineId;
                for (let i = 0; i < result.length; i++) {
                    line = result[i];
                    lineId = line.start + "-" + line.end;
                    fromNode = this.nodes[line.start];
                    toNode = this.nodes[line.end];
                    this.r.flowLine({from: fromNode, to: toNode}, this.lines[lineId]);
                }
            },
            getNode: function (id) {
                let nodes = this.data.nodes;
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].id === id) {
                        return nodes[i];
                    }
                }
                return null;
            },
            save: function () {
                if (this.readonly) {
                    return;
                }
                let params = {
                    _id: this.value._id,
                    content: JSON.stringify(this.data),
                };
                $.http(params, "/note/patch.do", function (reback) {
                    this.$parent.tip(reback.data);
                }, this, 4);
            }
        }
    }
</script>