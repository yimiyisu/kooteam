<template>
    <div class="k-flow">
        <div class="canvas"></div>
    </div>
</template>
<script>
    import Render from "../doc/flow/render"
    import Node from "../doc/flow/component/node"
    import Line from "../doc/flow/component/line"
    import Config from "../doc/flow/util/config"
    import Center from "../util/center"

    export default {
        props: ["value", "readonly"],
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
        watch: {
            value: function () {
                this.init();
            }
        },
        mounted: function () {
            $.lib(["/raphael.min.js"], this.init);
            $(".canvas", this.$el).draggable();
        },
        methods: {
            init: function () {
                let content = this.value.content;
                if (content) {
                    this.data = JSON.parse(content);
                }
                // 注册节点与连线
                if (!Raphael.fn.flowLine) {
                    Line();
                    Node();
                }
                let contentDom = $(".canvas", this.$el);
                if (this.r) {
                    this.r.clear();
                }
                this.r = Raphael(contentDom[0], Config.cavasSize, Config.cavasSize);
                Render.init(this.data, this.r, this);
                Center(contentDom, $(this.$el));
            }
        }
    }
</script>