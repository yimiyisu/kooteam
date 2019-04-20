import Grphic from "../util/graphic"

export default function () {
    Raphael.fn.flowNode = function (data, node) {
        let x = data.x,
            y = data.y,
            tempWidth = data.width,
            tempHeight = data.height,
            params = Grphic.get(data.type, x, y, tempWidth, tempHeight);// 根据类型获取节点参数
        let path = params.path,
            width = params.width,
            height = params.height,
            color = data.color,
            text = data.text;
        if (!color) {
            color = params.color;
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
        // 更新节点
        if (node) {
            if (text) {
                let txt = node.data("txt"), txtX = x + width / 2, txtY = y + height / 2;
                if (!txt) {
                    txt = this.text(txtX, txtY, text).data("id", data.id).attr({
                        fill: "#000",
                        "font-size": 13
                    });
                    node.data("txt", txt);
                } else {
                    txt.attr({text: text, x: txtX, y: txtY});
                }
            }
            attrs.path = path;
            node.attr(attrs);
            return node;
        }

        // 新增节点
        let paper = this, g = paper.path(path);
        if (text) {
            // 创建一个集合
            let txt = paper.text(x + width / 2, y + height / 2, text).data("id", data.id).attr({
                fill: "#000",
                "font-size": 13
            });
            g.data("txt", txt);
        }
        g.attr(attrs);
        g.data("id", data.id);
        g.mouseover(function () {
            $.emit("flowEvt", "nodeMouseover", this);
        });
        return g;
    };
}