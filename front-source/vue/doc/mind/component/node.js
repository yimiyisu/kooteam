const elHeight = 32;

import Color from "../../../util/colors"

function trigger(evt, target, type) {
    let data = {
        type: type,
        evt: evt,
        target: target
    };
    $.emit("mindEvt", "nodeEvent", data);
}

export default function () {
    Raphael.fn.mindNode = function (config, shape) {
        let x = config.x, y = config.y, width = config.width, id = config.id, color,
            attrs;
        let txtId = "t_" + id;
        let txt = this.getById(txtId), g = this.getById(id);
        txt.attr({x: x + width / 2, y: y + 15});
        if (shape === 1) {                            // 多色
            if (config.color === "#ffffff") {
                let randomIndex = Math.floor(Math.random() * Color.length);
                color = Color[randomIndex];
            } else {
                color = config.color;
            }
            attrs = {
                fill: color, stroke: color,
                "fill-opacity": 0.15, "stroke-width": 1, cursor: "pointer"
            };
        } else if (shape === 2) {                     // 单色
            if (config.id === "root") {
                attrs = {fill: "#ffffff", stroke: "#000", "fill-opacity": 0.15, "cursor": "pointer"};
            } else {
                attrs = {fill: "#ffffff", stroke: "", "fill-opacity": 0.15, "cursor": "pointer"};
            }
        } else {
            attrs = {
                fill: config.color, stroke: config.color,
                "fill-opacity": 0.15, "stroke-width": 1, cursor: "pointer"
            };
        }
        // g的初始化的值，需要重新获取
        if (g) {
            g.attr({x: x, y: y, width: width, height: elHeight});
            g.attr(attrs);
        } else {
            g = this.rect(x, y, width, elHeight, 3);
            g.click(function (evt) {
                trigger(evt, this, "click");
            });
            g.dblclick(function (evt) {
                trigger(evt, this, "dblclick");
            });
            g.mouseover(function (evt) {
                trigger(evt, this, "mouseover");
            });
            g.mouseout(function (evt) {
                trigger(evt, this, "mouseout");
            });
            g.attr(attrs);
            g.id = id;
            // g.node.id = grapId;
        }
    }
}