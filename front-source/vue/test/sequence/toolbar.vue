<template>
  <div
    class="toolbar"
    style="z-index: 4; position: absolute;left: 30px; top: 80px;width: 60px;border-radius: 2px;background: #F7F9FB;"
  >
    <div
      class="handle"
      style="cursor: move;height: 12px;text-align: center;overflow: hidden;font-size: 12px;color: #eee;line-height: 12px; border-radius: 2px 2px 0 0;background: #059DFD;"
    >
      <i class="ft icon">&#xe8ae;</i>
    </div>
    <div class="tools" style="border: 1px solid #E6E9ED">
      <div data-name="line_1" style="height: 60px;" v-on:click="drawLine">
        <svg class="svg">
          <text fill="#388bdd" x="5" y="40" class="text">绘制线条</text>
        </svg>
      </div>
      <div data-name="brokeLine" class="shape">
        <svg class="svg">
          <path stroke="#79aa1c" :d="brokeLine" class="path" />
          <text fill="#79aa1c" x="15" y="20" class="text">折线</text>
        </svg>
      </div>
      <div data-name="rect" class="shape">
        <svg class="svg">
          <path stroke="#009fe3" :d="rectPath" class="path" />
          <text fill="#009fe3" x="15" y="20" class="text">矩形</text>
        </svg>
      </div>
      <div data-name="circle" class="shape">
        <svg class="svg">
          <path stroke="#79aa1c" :d="circlePath" class="path" />
          <text fill="#79aa1c" x="15" y="20" class="text">圆形</text>
        </svg>
      </div>

      <div data-name="angle4" class="shape">
        <svg class="svg">
          <path stroke="#f80e15" :d="angle4Path" class="path" />
          <text fill="#f80e15" x="15" y="20" class="text">菱形</text>
        </svg>
      </div>
      <div data-name="ellipse" class="shape">
        <svg class="svg">
          <path stroke="#E7C004" :d="ellipsePath" class="path" />
          <text fill="#E7C004" x="15" y="20" class="text">椭圆</text>
        </svg>
      </div>
      <div data-name="shape_1" class="shape">
        <svg class="svg">
          <path stroke="#e17aff" :d="shape_1Path" class="path" />
          <text fill="#e17aff" x="15" y="15" class="text">文档</text>
        </svg>
      </div>
      <div data-name="shape_2" class="shape">
        <svg class="svg">
          <path stroke="#388bdd" :d="shape_2Path" class="path" />
          <text fill="#388bdd" x="15" y="10" class="text">步骤</text>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import Grphic from "./util/graphic";

export default {
  data: function() {
    return {
      isMove: false,
      circlePath: "",
      rectPath: "",
      angle4Path: "",
      ellipsePath: "",
      shape_1Path: "",
      shape_2Path: "",
      line_1: "",
      brokeLine: ""
    };
  },
  mounted: function() {
    $(".shape", this.$el).draggable({ appendTo: ".canvas", helper: "clone" });
    $(this.$el).draggable({ handle: ".handle" });
    this.rectPath = Grphic.get("rect", 10, 40, 40, 24, true);
    this.circlePath = Grphic.get("circle", 10, 35, 36, 36, true);
    this.angle4Path = Grphic.get("angle4", 10, 35, 36, 36, true);
    this.ellipsePath = Grphic.get("ellipse", 10, 35, 40, 24, true);
    this.shape_1Path = Grphic.get("shape_1", 10, 30, 40, 24, true);
    this.shape_2Path = Grphic.get("shape_2", 10, 25, 40, 24, true);
    this.brokeLine = Grphic.get("brokeLine", 10, 35, 40, 40, true);
  },
  methods: {
    hand: function() {
      this.isMove = !this.isMove;
      if (this.isMove) {
        return this.$parent.canvas.enable();
      }
      return this.$parent.canvas.disable();
    },
    drawLine: function() {
      let context = window.flowVue;
      context.r.isDrawLine = true;
      // 去掉节点的移动效果，放大热点
      let nodes = context.nodes;
      for (let key in nodes) {
        let nodeInfo = nodes[key];
        nodeInfo.undrag();
        nodeInfo.attr({ cursor: "crosshair" });
      }
    }
  }
};
</script>