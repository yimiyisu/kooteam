<template>
    <div class="z-mind" tabindex="-1">
        <Sidebar v-model="data" :class="{'show':!readonly}"></Sidebar>
        <div class="k-mind-map" @click.right="right">
            <!--<div class="k-mind-map">-->
            <Editor></Editor>
            <Tool></Tool>
        </div>
    </div>
</template>
<script>
    import MindNode from "./component/node"
    import MindLine from "./component/line"
    import Config from "./util/config"
    import Render from "./render"
    import Editor from "./editor"
    import Sidebar from "./sidebar"
    import Listener from "./util/listener"
    import Tool from "./tool"
    import Center from "../../util/center"

    export default {
        props: ["value", "readonly", "emitSave"],
        data: function () {
            return {
                current: null,// 当前选中的节点
                paper: null,// 当前画布对象
                data: {
                    id: "root",
                    ids: 1,
                    name: "新建思维导图",
                    children: [],
                    lineType: 1,     // 连接线类型      1 折线  2 曲线
                    grapType: 1,     // 节点类型        1 网型  2 树形（右） 3树形（左）
                    shape: 1,         //  节点形状       1 彩色  2 单色
                }
            }
        },
        components: {Node, Editor, Sidebar, Tool},
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
            $(".k-mind-map", this.$el).draggable();
        },
        methods: {
            init: function () {
                let content = this.value.content;
                if (content) {
                    this.data = JSON.parse(content);
                }
                Listener.init(this);
                if (!Raphael.fn.mindLine) {
                    // 注册自定义节点与线条
                    MindNode();
                    MindLine();
                    Listener.keydown();
                    Listener.keyboard();
                }
                let contentDom = $(".k-mind-map", this.$el);
                if (this.paper) {
                    this.paper.clear();
                }
                let data = this.data;
                let canvasSize = Config.cavasSize;
                this.paper = Raphael(contentDom.el[0], canvasSize, canvasSize);
                Render.init(data, this.paper);
                Center(contentDom.el[0]);
            },
            emitEditor: function (status) {
                this.$emit("showEditor", status, this.current);
                if (status) {
                    this.$emit("showTool", false);
                }
            },
            emitTool: function (status) {
                this.$emit("showTool", status, this.current);
            },
            save: function () {
                if (this.readonly) {
                    return;
                }
                let data = {
                    _id: this.value._id,
                    content: JSON.stringify(this.data),
                };
                $.http(data, "/note/patch.do", function (reback) {
                    this.$parent.tip(reback.data);
                }, this, 4);
                Render.reset(this.data, this.paper);
            },
            right: function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        }
    }
</script>