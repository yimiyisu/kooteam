import CalEnd from "../util/calEnd"
import NodeEvent from "./node";

const strokeWidth = 2;
// 鼠标开始绘制线条事件
export default {
    mousedown: function (e) {
        this.mark = 0;
        let context = window.flowVue;
        if (context.r.isDrawLine === true) {            // 是否开始画线
            this.startX = e.clientX;
            this.startY = e.clientY;
        }

    },
    mousemove: function (e) {
        let context = window.flowVue;
        this.endX = e.clientX;
        this.endY = e.clientY;
        if (this.startX && context.r.isDrawLine === true) {
            if (window.flowVue.r.drawLineStart) {
                let nodeTarget = window.flowVue.r.mouserOverTarget;
                if (!nodeTarget) {
                    if (this.mark === 0) {        // 标记，鼠标第一次移出节点，经过边框的位置
                        this.startX = e.clientX;
                        this.startY = e.clientY;
                    }
                    this.mark = this.mark + 1;
                }
            }
            let nodeTarget = window.flowVue.r.mouserOverTarget;
            let path = CalEnd.calPath(nodeTarget, this.endX, this.endY - 90, this.startX, this.startY - 90);
            if (!context.tempPath) {
                context.tempPath = context.r.path(path).attr({
                    stroke: "#aaa",
                    fill: "none",
                    "stroke-width": strokeWidth,
                });
            } else {
                context.tempPath.show();
                context.tempPath.attr({path: path});
            }
        }

    },
    mouseup: function (e) {
        let context = window.flowVue;
        if (context.tempPath) {
            context.tempPath.hide();
        }
        if (this.startX !== 0 && context.r.isDrawLine === true) {
            let nodeTarget = context.r.mouserOverTarget,
                points = CalEnd.calPoint(nodeTarget, this.endX, this.endY - 90, this.startX, this.startY - 90),
                id = "draw_" + zen.id(),
                config = {
                    points: points, id: id, from: {x: points[0].x, y: points[0].y},
                    end: {id: nodeTarget, x: points[points.length - 1].x, y: points[points.length - 1].y}
                };
            context.drawLine[id] = context.r.drawLine(config);
            context.r.isDrawLine = false;       // 初始化数据
            this.startX = 0;
            for (let key in context.nodes) {    // 回复节点的hover、drag效果
                let nodeInfo = context.nodes[key];
                nodeInfo.drag(NodeEvent.moving, NodeEvent.start, NodeEvent.end);
                nodeInfo.attr({"cursor": "move"});
            }
        }
    }
}