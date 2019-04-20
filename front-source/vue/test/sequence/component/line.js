import Line from "../util/line"
import LineEvents from "../event/line";
import TxtEvents from "../event/txt"
// 链接线
export default function () {
    Raphael.fn.flowLine = function (data) {
        let obj1, obj2, line, context = window.flowVue, color;
        if (data.line && data.from && data.to) {// 刷新线条
            line = data.line;
            obj1 = data.from;
            obj2 = data.to;
        } else {// 创建线
            obj1 = context.nodes[data.start];
            obj2 = context.nodes[data.end];
        }
        if (!obj1 || !obj2) {
            return;
        }
        if (!data.color) {
            color = "#aaa";
        } else {
            color = data.color;
        }
        let path = Line.z(obj1, obj2).path;       // 连线类型为折线
        if (line) {
            line.attr({path: path});
        } else {
            let result = {
                line: this.path(path).attr({
                    stroke: color,
                    "stroke-width": 1,
                    fill: "none",
                    "arrow-end": "block-wide-long",
                }),
                from: obj1,
                to: obj2,
            };
            result.line.click(LineEvents.click);
            result.line.mouseover(LineEvents.mouseover);
            result.line.mouseout(LineEvents.mouseout);
            result.line.dblclick(LineEvents.dbclick);
            let paper = this,
                conPoint = Line.z(obj1, obj2),
                txt = paper.text(conPoint.midX, conPoint.midY, data.text).attr({
                    fill: "#000",
                    "font-size": 13,
                });
            txt.dblclick(TxtEvents.dblclick);
            result.line.data("gp", txt);
            return result;
        }
    };
}