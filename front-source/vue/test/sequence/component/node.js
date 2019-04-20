import PointEvent from "../event/point"
import NodeEvent from "../event/node"
import Grphic from "../util/graphic"
import TxtEvents from "../event/txt";
import Enlarge from "../event/enlarge"

// 单个节点
const discattr = {fill: "#aaa", stroke: "#fff", cursor: "crosshair"};
const discattr2 = {fill: "#FFDAB9", stroke: "#FFDAB9", cursor: "auto"};
const exlen = 10;
export default function () {
    Raphael.fn.flowNode = function (config) {
        let x = config.x,
            y = config.y,
            tempWidth = config.width,
            tempHeight = config.height,
            params = Grphic.get(config.type, x, y, tempWidth, tempHeight),// 根据类型获取节点参数
            path = params.path,
            width = params.width,
            height = params.height,
            color = "",
            text = "";

        if (config.color === undefined || config.color === null) {
            color = params.color;
        } else {
            color = config.color;
        }
        if (config.text === undefined) {
            text = params.text;
        } else {
            text = config.text;
        }

        let x1 = x + width / 2, y1 = y, x2 = x + width, y2 = y1 + height / 2,
            x3 = x + width / 2, y3 = y + height, x4 = x, y4 = y + height / 2,
            x5 = x + width + exlen, y5 = y + height + exlen, // 右下角放大点坐标
            x6 = x + width + exlen, y6 = y - exlen,  // 右上角放大点坐标
            x7 = x - exlen, y7 = y - exlen,  // 左上角放大点坐标
            x8 = x - exlen, y8 = y + height + exlen;  // 左下角放大点坐标
        if (config.type === "shape_2") {  // 特殊情况  凹形图，凹点位置坐标需要偏移
            x4 = x + width / 6;
        }
        let paper = this,
            points = this.set(),
            txt = paper.text(x + width / 2, y + height / 2, text).attr({fill: "#000", "font-size": 13}),
            g = paper.path(path),
            point1 = paper.circle(x1, y1, 5).attr(discattr).data("parent", config.id).mouseover(mouseover).hide(),
            point2 = paper.circle(x2, y2, 5).attr(discattr).data("parent", config.id).mouseover(mouseover).hide(),
            point3 = paper.circle(x3, y3, 5).attr(discattr).data("parent", config.id).mouseover(mouseover).hide(),
            point4 = paper.circle(x4, y4, 5).attr(discattr).data("parent", config.id).mouseover(mouseover).hide(),
            point5 = paper.circle(x5, y5, 6).attr(discattr2).data("parent", config.id).hide(),
            point6 = paper.circle(x6, y6, 6).attr(discattr2).data("parent", config.id).hide(),
            point7 = paper.circle(x7, y7, 6).attr(discattr2).data("parent", config.id).hide(),
            point8 = paper.circle(x8, y8, 6).attr(discattr2).data("parent", config.id).hide();

        txt.dblclick(TxtEvents.dblclick);
        points.push(txt);
        points.push(point1);
        points.push(point2);
        points.push(point3);
        points.push(point4);
        points.push(point5);
        points.push(point6);
        points.push(point7);
        points.push(point8);

        for (let i = 5; i < points.length; i++) {
            let enlargePoint = points[i];
            enlargePoint.data("gp", points);
            enlargePoint.data("nodeId", config.id);
            enlargePoint.data("start", {x: x, y: y});
            enlargePoint.data("nodeName", config.type);
            enlargePoint.data("height", height);
            enlargePoint.data("width", width);
            enlargePoint.data("pointName", i);
            enlargePoint.drag(Enlarge.moving, Enlarge.start, Enlarge.end);
        }

        let attrs = {
            fill: color,
            stroke: color,
            "fill-opacity": 0.15,
            "stroke-width": 1,
            cursor: "move",
            "x": x,
            "y": y
        };
        g.attr(attrs);
        g.data("height", height);
        g.data("width", width);
        g.data("gp", points);
        g.data("id", config.id);
        g.data("type", config.type);
        g.data("nodeId", config.id);
        g.node.oncontextmenu = function () {
            return false;
        };
        g.dblclick(NodeEvent.dblClick);
        g.mouseover(NodeEvent.mouseOver);
        g.click(NodeEvent.click);
        g.mouseout(NodeEvent.mouseout);
        g.drag(NodeEvent.moving, NodeEvent.start, NodeEvent.end);

        return g;

    };
}

// 复制节点
function mouseover() {
    let context = window.flowVue;
    if (context.point) {
        context.point.remove();
        context.point = null;
    }
    let point = this.clone();
    let config = {
        parent: this.data("parent"),
        x: this.attr("cx"),
        y: this.attr("cy")
    };
    point.data("config", config);
    point.drag(PointEvent.moving, PointEvent.start, PointEvent.end).onDragOver(PointEvent.dragOver);
    context.point = point;
}

