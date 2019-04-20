import Line from "../util/line"

// 链接线
export default function () {
    Raphael.fn.flowLine = function (data, line) {
        let from = data.from, to = data.to;
        if (!from || !to) {
            return;
        }
        let color = "#aaa", linePath = Line.z(from, to);       // 连线类型为折线
        if (line) {
            let path = line.line;
            path.attr({path: linePath.path});
            renderText(linePath.midX, linePath.midY, data.text, path, this);
            return line;
        }
        let path = this.path(linePath.path).attr({
            stroke: color,
            "stroke-width": 1,
            fill: "none",
            "arrow-end": "block-wide-long",
        });

        // 线条事件，重新构建
        path.mouseover(function () {
            trigger("mouseover", this);
        });
        path.click(function () {
            trigger("click", this);
        });
        path.dblclick(function () {
            trigger("click", this);
        });
        let id = from.data("id") + "-" + to.data("id");
        path.data("id", id);
        if (data.text) {
            renderText(linePath.midX, linePath.midY, data.text, path, this);
        }
        return {
            line: path,
            from: from,
            to: to,
            id: id
        };
    };
}

function renderText(x, y, text, path, paper) {
    let txt = path.data("txt"), txtBg, bbox, txtWidth, txtHeight;
    if (!txt && !text) {
        return;
    }
    if (!txt) {
        txt = paper.text(x, y, text).attr({
            fill: "#000",
            "font-size": 13,
        });
        txt.click(function () {
            let target = this.prev.prev;
            trigger("click", target);
        });
        bbox = txt.getBBox();
        txtWidth = bbox.width;
        txtHeight = bbox.height;
        txtBg = paper.rect(x - txtWidth / 2, y - txtHeight / 2, txtWidth, txtHeight).attr({
            fill: "#fff",
            stroke: "#fff",
            "stroke-width": 4,
        });
        txtBg.insertBefore(txt);
        txt.data("id", path.data("id"));
        path.data("txt", txt);
        return path.data("txtBg", txtBg);
    }

    let param = {x: x, y: y};
    if (text !== undefined) {
        param.text = text;
    }
    txt.attr(param);
    bbox = txt.getBBox();
    txtWidth = bbox.width;
    txtHeight = bbox.height;
    txtBg = path.data("txtBg");
    txtBg.attr({x: x - txtWidth / 2, y: y - txtHeight / 2, width: txtWidth, height: txtHeight});
}

function trigger(type, target) {
    let params = {
        type: type,
        target: target
    };
    $.emit("flowEvt", "lineEvent", params);
}