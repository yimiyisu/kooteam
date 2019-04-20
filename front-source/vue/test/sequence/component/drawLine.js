// 链接线
import LineMoveEvt from "../event/lineMove";
import Line from "../util/line";
import LinePointEvt from "../event/linePoint"


const strokeWidth = 2;
const discattr = {fill: "#aaa", stroke: "#fff", cursor: "move"};
const discattrS = {fill: "#FF6A6A", stroke: "#fff", cursor: "move"};


export default function () {
    Raphael.fn.drawLine = function (config) {
        let context = window.flowVue;
        let result;
        let points = config.points;
        let paths = [];

        // 添加线条两端的热点
        let start = config.from;
        let end = config.end;
        let paper = this;
        let startPoint, endPoint;
        startPoint = paper.circle(start.x, start.y, 5).attr(discattrS);
        endPoint = paper.circle(end.x, end.y, 5).attr(discattr);
        startPoint.drag(LinePointEvt.moving, LinePointEvt.start, LinePointEvt.end).onDragOver(LinePointEvt.dragOver);
        endPoint.drag(LinePointEvt.moving, LinePointEvt.start, LinePointEvt.end).onDragOver(LinePointEvt.dragOver);
        let lineParam1 = {
            id: config.id,
            paths: paths,
            unMovePoint: {id: end.id, x: end.x, y: end.y, isStart: false},
            moveName: "startPoint"
        };
        let lineParam2 = {
            id: config.id,
            paths: paths,
            unMovePoint: {id: start.id, x: start.x, y: start.y, isStart: true},
            moveName: "endPoint"
        };
        startPoint.data("lineParam", lineParam1);
        endPoint.data("lineParam", lineParam2);
        startPoint.data("points", {start: startPoint, end: endPoint});
        endPoint.data("points", {start: startPoint, end: endPoint});
        // 隐藏热点
        startPoint.hide();
        endPoint.hide();

        // 判断线段是垂直方向还是水平方向
        for (let i = 0; i < points.length - 1; i++) {
            let cursor, start = points[i], end = points[i + 1];
            if (points[i].x === points[i + 1].x) {
                cursor = "w-resize";  // 可水平方向移动
            }
            if (points[i].y === points[i + 1].y) {
                cursor = "s-resize";  //  可垂直方向移动
            }
            let mindPath = context.r.path(Line.temp5(start, end)).attr({
                stroke: "#aaa", fill: "none", "stroke-width": strokeWidth,
            });
            mindPath.data("cursor", cursor);
            mindPath.data("start", {x: start.x, y: start.y});
            mindPath.data("end", {x: end.x, y: end.y});
            mindPath.data("points", {start: startPoint, end: endPoint});
            mindPath.data("line", mindPath);
            mindPath.mouseover(LineMoveEvt.mouseOver);
            // mindPaht.mouseout()
            paths.push(mindPath);
        }

        // 添加线段移动属性，起始和结束线条除外
        for (let i = 1; i < paths.length - 1; i++) {
            let cursor = paths[i].data("cursor");
            paths[i].attr({"cursor": cursor});
            paths[i].drag(LineMoveEvt.moving, LineMoveEvt.start, LineMoveEvt.end);
            paths[i].data("paths", paths);
            paths[i].data("i", i);
        }
        for (let i = 0; i < paths.length; i++) {
            paths[i].data("lines", paths);
        }
        result = {
            id: config.id,
            points: config.points,
            from: config.from,
            end: config.end,
            paths: paths,
            startPoint: startPoint,
            endPoint: endPoint,
        };


        return result;
    }
    ;
}