<template>
    <div class="toolbar">
        <div class="handle">
            <i class="z-icon">&#xe25d;</i>
        </div>
        <div class="tools">
            <div data-name="circle" class="shape">
                <svg class="svg">
                    <path stroke="#79aa1c" :d="circlePath" class="path"></path>
                    <text fill="#79aa1c" x="15" y="20" class="text">圆形</text>
                </svg>
            </div>
            <div data-name="rect" class="shape">
                <svg class="svg">
                    <path stroke="#009fe3" :d="rectPath" class="path"></path>
                    <text fill="#009fe3" x="15" y="20" class="text">矩形</text>
                </svg>
            </div>
            <div data-name="angle4" class="shape">
                <svg class="svg">
                    <path stroke="#f80e15" :d="angle4Path" class="path"></path>
                    <text fill="#f80e15" x="15" y="20" class="text">菱形</text>
                </svg>
            </div>
            <div data-name="ellipse" class="shape">
                <svg class="svg">
                    <path stroke="#E7C004" :d="ellipsePath" class="path"></path>
                    <text fill="#E7C004" x="15" y="20" class="text">椭圆</text>
                </svg>
            </div>
            <div data-name="document" class="shape">
                <svg class="svg">
                    <path stroke="#e17aff" :d="documentPath" class="path"></path>
                    <text fill="#e17aff" x="15" y="15" class="text">文档</text>
                </svg>
            </div>
            <div data-name="step" class="shape">
                <svg class="svg">
                    <path stroke="#388bdd" :d="stepPath" class="path"></path>
                    <text fill="#388bdd" x="15" y="10" class="text">步骤</text>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
    import Grphic from "./util/graphic"

    export default {
        data: function () {
            return {
                isMove: false,
                circlePath: "",
                rectPath: "",
                angle4Path: "",
                ellipsePath: "",
                documentPath: "",
                stepPath: "",

            }
        },
        mounted: function () {
            $(".shape", this.$el).draggable({appendTo: ".canvas", helper: "clone"});
            $(this.$el).draggable({handle: ".handle"});
            this.rectPath = Grphic.get("rect", 10, 40, 40, 24, true);
            this.circlePath = Grphic.get("circle", 10, 35, 36, 36, true);
            this.angle4Path = Grphic.get("angle4", 10, 35, 36, 36, true);
            this.ellipsePath = Grphic.get("ellipse", 10, 35, 40, 24, true);
            this.documentPath = Grphic.get("document", 10, 30, 40, 24, true);
            this.stepPath = Grphic.get("step", 10, 25, 40, 24, true);
        }
    }
</script>