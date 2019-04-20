import Line from "../util/line";

export default {
    start: function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
    },
    moving: function (dx, dy) {
        let config = this.data("config"), context = window.flowVue;

        let att = {cx: this.ox + dx, cy: this.oy + dy, r: 30, stroke: "none", "fill-opacity": 0.05};
        this.attr(att);
        let path = Line.temp(config.x, config.y, att.cx, att.cy);
        if (!context.tempPath) {
            context.tempPath = context.r.path(path).attr({stroke: "#aaa", fill: "none"});
        } else {
            context.tempPath.show();
            context.tempPath.attr({path: path});
        }
    },
    end: function () {
        let end = this.data("target"),
            start = this.data("config").parent,
            context = window.flowVue;
        context.point.remove();
        context.point = null;
        if (!context.tempPath) {
            return;
        }
        context.tempPath.hide();
        if (!end || end === start) {// 或者目标类型不正确
            return;
        }
        let config = {start: start, end: end, text: ""},
            lineId = start + "-" + end;
        let mark = false;
        if (context.lines[lineId] && context.lines[lineId].line.id) {
            mark = true;
        }
        if (mark === true) {
            return
        }
        context.lines[lineId] = context.r.flowLine(config);
        // 添加连线后，保存数据
        context.save();
    },
    dragOver: function (el) {
        let id = el.data("id");
        if (id) {
            this.data("target", id);
        }
    },
    hide: function () {
        let context = window.flowVue;
        if (!context.currentNode) {
            return;
        }
        let gp = context.currentNode.data("gp");
        for (let i = 1; i < gp.length; i++) {
            gp[i].hide();
        }
        if (context.point) {
            context.point.remove();
            context.point = null;
        }
    },
}