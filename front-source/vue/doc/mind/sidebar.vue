<template>
    <div class="toolbar">
        <div class="handle">
            <i class="z-icon">&#xe25d;</i>
        </div>
        <div class="tools">
            <div class="attr">
                {{grapType[grap]}}
                <div>
                    <!--2 右侧分布  3 左侧分布  4 上下分布 5 下面分布  6 上面分布-->
                    <span @click="choseGrapType('1')">{{grapType['1']}}</span>
                    <span @click="choseGrapType('3')">{{grapType['3']}}</span>
                    <span @click="choseGrapType('2')">{{grapType['2']}}</span>
                    <span @click="choseGrapType('4')">{{grapType['4']}}</span>
                    <span @click="choseGrapType('5')">{{grapType['5']}}</span>
                    <span @click="choseGrapType('6')">{{grapType['6']}}</span>
                </div>
            </div>
            <!--<div class="attr">-->
            <!--彩色-->
            <!--<div>-->
            <!--<span>单色</span>-->
            <!--<span>多色</span>-->
            <!--</div>-->
            <!--</div>-->
            <div class="attr">
                {{lineType[line]}}
                <div>
                    <span @click="choseLineType('1')">{{lineType['1']}}</span>
                    <span @click="choseLineType('2')">{{lineType['2']}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Render from "./render"

    export default {
        props: ["value"],
        data: function () {
            return {
                line: 1,
                grap: 1,
                lineType: {1: "折线", 2: "曲线"},
                grapType: {
                    1: "左右", 2: "向右", 3: "向左",
                    4: "上下", 5: "向下", 6: "向上"
                }
            }
        },
        mounted: function () {
            this.line = this.value.lineType;
            this.grap = this.value.grapType;
            $(this.$el).draggable(".handle");
        },
        methods: {
            choseLineType: function (option) {
                if (this.line === option) {
                    return;
                }
                let context = this.$parent;
                this.line = option;
                context.data.lineType = option;
                Render.reset(context.data, context.paper);
            },
            choseGrapType: function (option) {
                if (this.grap === option) {
                    return;
                }
                let context = this.$parent;
                this.grap = option;
                context.data.grapType = option;
                Render.reset(context.data, context.paper);
            }
        }
    }
</script>