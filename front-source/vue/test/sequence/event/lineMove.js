import Line from "../util/line"

// 折线中间线条移动事件
export default {
    start: function (x, y, evt) {
        evt.stopPropagation();
        this.startX = this.data("start").x;
        this.startY = this.data("start").y;
        this.endX = this.data("end").x;
        this.endY = this.data("end").y;
    },
    moving: function (dx, dy) {
        let start = {x: this.startX, y: this.startY};
        let end = {x: this.endX, y: this.endY};
        let cursor = this.data("cursor");
        let newPath;
        if (cursor === "w-resize") {   // 水平方向移动
            start.x = start.x + dx;
            end.x = end.x + dx;
        } else {        // 垂直方向移动
            start.y = start.y + dy;
            end.y = end.y + dy;
        }
        newPath = Line.temp5(start, end);
        // 修改上一个线条的终点 和 下一个线条的起点
        let paths = this.data("paths");
        let i = this.data("i");
        let startFront = paths[i - 1].data("start");
        let newPathFront = Line.temp5(startFront, start);
        let endBehind = paths[i + 1].data("end");
        let newPathBehind = Line.temp5(end, endBehind);
        this.attr({path: newPath});
        paths[i - 1].attr({path: newPathFront});
        paths[i + 1].attr({path: newPathBehind});
        //重置参数
        paths[i - 1].data("end", start);
        paths[i + 1].data("start", end);
        paths[i].data("start", start);
        paths[i].data("end", end);
        for (let i = 0; i < paths.length; i++) {
            paths[i].data("paths", paths);
        }
    },
    end: function (e) {

    },
    mouseOver: function () {
        let points = this.data("points");
        points.start.show();
        points.end.show();
        let lines = this.data("lines");
        for (let i = 0; i < lines.length; i++) {
            lines[i].attr({
                "stroke-width": 5,
            });
        }
    },
    mouseOut: function () {

    }
}