import CalEnd from "../util/calEnd";

const strokeWidth = 2;
// 线条起点和终点移动事件
export default {
    start: function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        let lineParam = this.data("lineParam");
        for (let i = 0; i < lineParam.paths.length; i++) {   // 删除之前的线条
            lineParam.paths[i].remove();
        }
    },
    moving: function (dx, dy) {
        let context = window.flowVue;
        let att = {cx: this.ox + dx, cy: this.oy + dy};
        this.attr(att);
        let lineParam = this.data("lineParam");
        let nStart, nEnd;
        let nodeTarget = this.data("target");
        nStart = lineParam.unMovePoint;
        nEnd = {x: att.cx, y: att.cy};
        this.startXY = nStart;
        this.endXY = nEnd;
        let path;
        if (nodeTarget !== undefined && nStart.id === nodeTarget) {
            if (nStart.isStart) {
                path = CalEnd.calPathSE(nodeTarget, nStart.x, nStart.y, nEnd.x, nEnd.y);
            } else {
                path = CalEnd.calPathSE(nodeTarget, nEnd.x, nEnd.y, nStart.x, nStart.y);
            }
        } else { // 线条未移动的端点不在该节点上
            path = CalEnd.calPath(nodeTarget, nEnd.x, nEnd.y, nStart.x, nStart.y);
        }
        if (context.tempPath) {
            context.tempPath.remove();
        }
        context.tempPath = context.r.path(path).attr({
            stroke: "#aaa",
            fill: "none",
            "stroke-width": strokeWidth,
        });
    },
    end: function () {
        let context = window.flowVue;
        if (context.tempPath) {
            context.tempPath.hide();
        }
        // 绘制新的线条
        let lineParam = this.data("lineParam"), id = lineParam.id;
        let lineInfo = context.drawLine[id];
        let moveName = lineParam.moveName;
        let unMovePoint = lineParam.unMovePoint;
        let nodeTarget = this.data("target");
        if (!this.endXY) {
            // 单击连接点会出现这种情况
            debugger
        }
        let points;
        if (nodeTarget !== undefined && nodeTarget === unMovePoint.id) { // 起点和终点都在同一个图形上
            points = CalEnd.calPointSE(nodeTarget, unMovePoint.x, unMovePoint.y, this.endXY.x, this.endXY.y)
        } else {
            points = CalEnd.calPoint(nodeTarget, this.endXY.x, this.endXY.y, this.startXY.x, this.startXY.y);
        }
        let config;
        if (moveName === "endPoint") {
            config = {
                points: points, id: id, from: unMovePoint,
                end: {id: nodeTarget, x: points[points.length - 1].x, y: points[points.length - 1].y}
            };
            if (config.from.id) {
                config.from.id = lineInfo.from.id;
            }
        }
        else {
            config = {
                points: points, id: id, end: unMovePoint,
                from: {id: nodeTarget, x: points[points.length - 1].x, y: points[points.length - 1].y}
            };
            if (config.end.id) {
                config.end.id = lineInfo.end.id;
            }
        }
        context.drawLine[id] = context.r.drawLine(config);
        lineInfo.startPoint.remove();
        lineInfo.endPoint.remove();
    },
    dragOver: function (el) {
        let id = el.data("id");
        if (id) {
            this.data("target", id);
        } else {
            this.data("target", undefined);
        }
    },
}