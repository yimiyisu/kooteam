export default {
    // 折线
    z: function (obj1, obj2) {
        let conPoint = this.temp2(obj1, obj2),
            start = conPoint.start,
            end = conPoint.end,
            startX = parseInt(conPoint.startX),
            startY = parseInt(conPoint.startY),
            endX = parseInt(conPoint.endX),
            endY = parseInt(conPoint.endY),
            exlen = parseInt(Math.abs(endX - startX) / 4),
            obj1Type = obj1.data("type"),
            obj2Type = obj2.data("type"),
            obj1Width = obj1.data("width"),
            obj2Width = obj2.data("width");
        if (exlen < 20) {
            exlen = 20;
        }

        if (start === 0) {
            startY -= exlen;
        } else if (start === 1) {
            startY += exlen;
        } else if (start === 2) {
            if (obj1Type === "step") {    // 特殊情况，以凹点为起点
                startX = startX + (obj1Width / 6);
            } else {
                startX -= exlen;
            }
        } else if (start === 3) {
            startX += exlen;
        }
        if (end === 4) {
            endY -= exlen;
        } else if (end === 5) {
            endY += exlen;
        } else if (end === 6) {
            if (obj2Type === "step") {   // 特殊情况，以凹点为终点
                endX -= exlen;
                conPoint["endX"] = endX + exlen + obj2Width / 6;
            } else {
                endX -= exlen;
            }
        } else if (end === 7) {
            endX += exlen;
        }

        let path = ["M", conPoint.startX, conPoint.startY, "L", startX, startY,
            "L", endX, startY, "L", endX, endY, "L", conPoint.endX, conPoint.endY].join(",");
        let midX = startX + (endX - startX) / 2;
        return {
            "midX": midX,
            "midY": startY,
            "startX": startX,
            "startY": startY,
            "endX": endX,
            "endY": endY,
            "path": path,
        };
    },
    // 曲线
    c: function (obj1, obj2) {
        let conPoint = this.temp2(obj1, obj2),
            x1 = parseInt(conPoint.startX),
            y1 = parseInt(conPoint.startY),
            x4 = parseInt(conPoint.endX),
            y4 = parseInt(conPoint.endY),
            res = [conPoint.start, conPoint.end],
            dx = Math.max(Math.abs(x1 - x4) / 2, 10),
            dy = Math.max(Math.abs(y1 - y4) / 2, 10),
            x2 = [x1, x1, x1 - dx, x1 + dx][res[0]],
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]],
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]],
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]];
        return ["M", x1, y1, "C", x2, y2, x3, y3, x4, y4].join(",");
    },
    // s线
    temp: function (x1, y1, x4, y4) {
        return ["M", x1, y1, "L", x1, y4, "L", x4, y4].join(",")
    },
    temp2: function (obj1, obj2) {
        let bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox();
        let p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
                {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
            d = {}, dis = [];
        let res, dx, dy;
        for (let i = 0; i < 4; i++) {
            for (let j = 4; j < 8; j++) {
                dx = Math.abs(p[i].x - p[j].x);
                dy = Math.abs(p[i].y - p[j].y);
                if ((i === j - 4) || (((i !== 3 && j !== 6) || p[i].x < p[j].x) && ((i !== 2 && j !== 7) || p[i].x > p[j].x) && ((i !== 0 && j !== 5) || p[i].y > p[j].y) && ((i !== 1 && j !== 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }
        if (dis.length === 0) {
            res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        let x1 = p[res[0]].x.toFixed(3),
            y1 = p[res[0]].y.toFixed(3),
            x4 = p[res[1]].x.toFixed(3),
            y4 = p[res[1]].y.toFixed(3);
        // 增加横向线条中点的位置
        let midX = parseInt(x1) + (parseInt(x4) - parseInt(x1)) / 2;
        let midY = parseInt(y1);
        return {
            "start": res[0],
            "end": res[1],
            "startX": x1,
            "startY": y1,
            "endX": x4,
            "endY": y4,
            "midX": midX,
            "midY": midY
        };
    }
}