<template>
    <div class="z-mind">
        <div class="k-mind-map">
        </div>
    </div>
</template>
<script>
    import MindNode from "../doc/mind/component/node"
    import MindLine from "../doc/mind/component/line"
    import Config from "../doc/mind/util/config"
    import Render from "../doc/mind/render"
    import Center from "../util/center"

    export default {
        props: ["value"],
        data: function () {
            return {
                readonly: true,
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
        watch: {
            value: function () {
                this.init();
            }
        },
        mounted: function () {
            $.lib(["/raphael.min.js"], this.init);
            let dom = $(".k-mind-map", this.$el);
            dom.draggable();
        },
        methods: {
            init: function () {
                let content = this.value.content;
                if (content) {
                    this.data = JSON.parse(content);
                }
                if (!Raphael.fn.mindLine) {
                    // 注册自定义节点与线条
                    MindNode();
                    MindLine();
                }
                let contentDom = $(".k-mind-map", this.$el).el[0];
                if (this.paper) {
                    this.paper.clear();
                }
                let data = this.data;
                let canvasSize = Config.cavasSize;
                this.paper = Raphael(contentDom, canvasSize, canvasSize);
                Render.init(data, this.paper);
                Center(contentDom, $(this.$el));
            }
        }
    }
</script>