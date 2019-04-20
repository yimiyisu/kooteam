import PointEvent from "./point"
import Line from "../util/line"
import PatchAndQuery from "../util/patchAndQuery"
import CalEnd from "../util/calEnd"

const exlen = 10;
export default {
    // 单个节点
    start: function (x, y, evt) {
        evt.stopPropagation();
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        this.lastX = x;
        this.lastY = y;
        let id = this.data("id");
        // 保存原有的信息
        let context = window.flowVue, line, oLine = {}, lineId, oLineSE = {};
        for (let key in context.drawLine) {
            line = context.drawLine[key];
            if (line.from.id === id || line.end.id === id) {
                lineId = line.id;
                // if (line.from.id === id && line.end.id === id) { // 起点和终点都在该节点上
                //     oLineSE[lineId] = line;
                // } else {
                //     oLine[lineId] = line;
                // }
                oLine[lineId] = line;

            }
        }
        this.oLine = oLine;
        this.oLineSE = oLineSE;
    },

    moving: function (dx, dy, x, y) {
        let att = {x: this.ox + dx, y: this.oy + dy};
        let gp = this.data("gp");
        let nx = att.x, ny = att.y, width = this.data("width"), height = this.data("height");
        let x1 = nx + width / 2, y1 = ny, x2 = nx + width, y2 = y1 + height / 2,
            x3 = nx + width / 2, y3 = ny + height, x4 = nx, y4 = ny + height / 2;
        let x5 = nx + width + exlen, y5 = ny + height + exlen;  // 右下角放大点坐标
        let x6 = nx + width + exlen, y6 = ny - exlen;  // 右上角放大点坐标
        let x7 = nx - exlen, y7 = ny - exlen;  // 左上角放大点坐标
        let x8 = nx - exlen, y8 = ny + height + exlen;  // 左下角放大点坐标
        if (this.data("type") === "shape_2") {
            x4 = nx + width / 6;
        }
        gp[1].attr({cx: x1, cy: y1});
        gp[2].attr({cx: x2, cy: y2});
        gp[3].attr({cx: x3, cy: y3});
        gp[4].attr({cx: x4, cy: y4});
        gp[5].attr({cx: x5, cy: y5});
        gp[6].attr({cx: x6, cy: y6});
        gp[7].attr({cx: x7, cy: y7});
        gp[8].attr({cx: x8, cy: y8});

        gp[0].attr({x: nx + width / 2, y: ny + height / 2});
        this.attr(att);

        // 同步更新线条
        let context = window.flowVue, line, id = this.data("id");
        if (context.point) {
            context.point.remove();
            context.point = null;
        }

        for (let key in context.lines) {
            line = context.lines[key];
            // 同步更新线条的文本位置  以该节点为起点的线条 以该节点为终点的线条
            if (line.from.data("id") === id || line.to.data("id") === id) {
                context.r.flowLine(line);
                let lineId = line.line.id;
                let result = PatchAndQuery.queryPathType(lineId);
                let txtId = result.txtId;
                let txt = context.r.getById(txtId);
                let conPoint = Line.z(line.from, line.to);
                txt.attr({x: conPoint.midX, y: conPoint.midY});
            }
        }
        // 同步更新绘制的path
        let deltaX = x - this.lastX;
        let deltaY = y - this.lastY;
        this.translate(deltaX, deltaY);
        this.lastX = x;
        this.lastY = y;

        // 更新放大点中的参数，节点的起始位置
        for (let i = 5; i < gp.length; i++) {
            gp[i].data("start", {x: nx, y: ny});
        }

        // 更新 drawLine
        let oLine = this.oLine, oDraw;
        for (let key in context.drawLine) {
            line = context.drawLine[key];
            let oEndX, oEndY, startX, startY, config = {}, points;
            if (line.from.id === id || line.end.id === id) {
                oDraw = oLine[key];
                // 删除之前的线条，重新绘制新的线条
                for (let j = 0; j < line.paths.length; j++) {
                    line.paths[j].remove();
                }
                line.startPoint.remove();
                line.endPoint.remove();
                oEndX = oDraw.end.x;
                oEndY = oDraw.end.y;
                startX = oDraw.from.x;
                startY = oDraw.from.y;
                let nStartX = startX + dx;
                let nStartY = startY + dy;
                let nEndx = oEndX + dx;
                let nEndy = oEndY + dy;
                if (line.from.id === id && line.end.id === id) {   // 起点和终点都在该节点上
                    points = CalEnd.calPointSE(id, nStartX, nStartY, nEndx, nEndy);
                    config = {
                        points: points, id: key, from: {id: id, x: points[0].x, y: points[0].y},
                        end: {id: id, x: points[points.length - 1].x, y: points[points.length - 1].y}
                    };
                } else {
                    if (line.from.id === id) {
                        points = CalEnd.calPoint(id, nStartX, nStartY, oEndX, oEndY);
                        // 倒装数组
                        let newPoints = [], j = 0;
                        for (let i = points.length - 1; i >= 0; i--) {
                            newPoints[j] = points[i];
                            j++;
                        }
                        config = {
                            points: newPoints, id: key, end: line.end,
                            from: {id: id, x: points[points.length - 1].x, y: points[points.length - 1].y}
                        };
                    }
                    if (line.end.id === id) {
                        points = CalEnd.calPoint(id, nEndx, nEndy, startX, startY);
                        config = {
                            points: points, id: key,
                            from: line.from,
                            end: {id: id, x: points[points.length - 1].x, y: points[points.length - 1].y}
                        };
                    }
                }
                context.drawLine[key] = context.r.drawLine(config);
            }
        }
    },
    end: function () {
        // 更新 drawLine参数
        let context = window.flowVue, line;
        for (let key in context.drawLine) {
            line = context.drawLine[key];
            let from = line.points[0], end = line.points[line.points.length - 1];
            line.from.x = from.x;
            line.from.y = from.y;
            line.end.x = end.x;
            line.end.y = end.y;
        }
    },
    mouseOver: function () {
        let context = window.flowVue, gp;
        PointEvent.hide();
        context.currentNode = this;
        gp = this.data("gp");
        let isDrawLine = window.flowVue.r.isDrawLine;
        if (isDrawLine) {
            for (let i = 1; i < gp.length - 4; i++) {
                gp[i].show();
            }
        } else {
            for (let i = 1; i < gp.length; i++) {
                gp[i].show();
            }
        }
        context.r.mouserOverTarget = this.data("id");

    },
    dblClick: function () {
        let id = window.flowVue.currentTargetId;
        $.emit("editFlow", id);
    },
    click: function () {
        let id = window.flowVue.currentNode.id,
            nodeInfo = PatchAndQuery.queryPathType(id);
        window.flowVue.currentTargetId = nodeInfo.oldId;
    },
    mouseout: function () {
        window.flowVue.r.mouserOverTarget = null;
    }
}