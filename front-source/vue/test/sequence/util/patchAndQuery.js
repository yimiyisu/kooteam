import Line from "./line"
import Graphic from "../util/graphic"
import CalEnd from "../util/calEnd"

export default {
    getInfo: function (id) {
        let context = window.flowVue,
            queryResult = {},
            result = this.queryPathType(id);
        if (result) {
            let tempItem = context.r.getById(result.pathId),
                tempTxt = context.r.getById(result.txtId),
                tempBox = tempItem.getBBox();
            if (result.type === "node") {
                queryResult = {
                    type: result.type,
                    x: tempItem.attrs.x,
                    y: tempItem.attrs.y,
                    txtId: result.txtId,
                    txtContent: tempTxt.attrs.text,
                    boxWidth: tempBox.width,
                    boxHeight: tempBox.height,
                    txt: tempTxt,
                    pathId: result.pathId,
                    nodeType: result.nodeType,
                    color: tempItem.attrs.fill,
                    width: result.width,
                    height: result.height,
                    oldId: result.oldId,
                };
            } else if (result.type === "line") {
                for (let key in context.lines) {
                    let tempLine = context.lines[key];
                    if (result.pathId === tempLine.line.id) {
                        let obj1 = tempLine.from,
                            obj2 = tempLine.to,
                            tempPath = Line.temp2(obj1, obj2);
                        queryResult = {
                            type: result.type,
                            x: tempPath.midX,
                            y: tempPath.midY,
                            txtId: result.txtId,
                            txtContent: tempTxt.attrs.text,
                            boxWidth: tempBox.width,
                            boxHeight: tempBox.height,
                            txt: tempTxt,
                            pathId: result.pathId,
                            start: this.queryPathType(obj1.id).oldId,
                            end: this.queryPathType(obj2.id).oldId,
                            color: tempLine.line.attrs.stroke,
                        };
                    }
                }

            }
        }
        return queryResult;
    },
    queryPathType: function (id) {
        let context = window.flowVue, result = null;
        for (let key in context.nodes) {
            let nodeInfo = context.nodes[key],
                gp = nodeInfo.data("gp"),
                txtInfo = gp[0];
            if (nodeInfo.id === id || txtInfo.id === id || key === id) {
                result = {
                    type: "node",
                    pathId: nodeInfo.id,
                    txtId: gp[0].id,
                    point1Id: gp[1].id,
                    point2Id: gp[2].id,
                    point3Id: gp[3].id,
                    point4Id: gp[4].id,
                    nodeType: nodeInfo.data("type"),
                    width: nodeInfo.data("width"),
                    height: nodeInfo.data("height"),
                    oldId: key,
                };
            }
        }
        for (let key in context.lines) {
            let linesInfo = context.lines[key],
                txtInfo = linesInfo.line.data("gp");
            if (linesInfo.line.id === id || txtInfo.id === id || key === id) {
                result = {
                    type: "line",
                    pathId: linesInfo.line.id,
                    txtId: txtInfo.id,
                    oldId: key,
                };
            }
        }
        return result;
    },
    patchData: function () {
        let context = window.flowVue,
            tempNodes = [],
            tempLines = [],
            tempDrawLine = [];
        for (let key in context.nodes) {
            let nodeInfo = context.nodes[key],
                tempId = nodeInfo.id,
                tempNodeInfo = this.getInfo(tempId),
                nodeParams = {
                    x: tempNodeInfo.x,
                    y: tempNodeInfo.y,
                    type: tempNodeInfo.nodeType,
                    width: tempNodeInfo.width,
                    height: tempNodeInfo.height,
                    id: tempNodeInfo.oldId,
                    color: tempNodeInfo.color,
                    text: tempNodeInfo.txtContent
                };
            tempNodes.push(nodeParams);
        }
        for (let key in context.lines) {
            let lineInfo = context.lines[key],
                tempId = lineInfo.line.id,
                tempLineInfo = this.getInfo(tempId),
                lineParams = {
                    start: tempLineInfo.start,
                    end: tempLineInfo.end,
                    text: tempLineInfo.txtContent,
                    color: tempLineInfo.color
                };
            tempLines.push(lineParams);
        }
        for (let key in context.drawLine) {
            let lineInfo = context.drawLine[key],
                lineParams = {
                    id: lineInfo.id,
                    from: {id: lineInfo.from.id, x: lineInfo.from.x, y: lineInfo.from.y},
                    end: {id: lineInfo.end.id, x: lineInfo.end.x, y: lineInfo.end.y},
                    points: lineInfo.points,
                    text: lineInfo.text
                };
            tempDrawLine.push(lineParams);
        }
        return {"nodes": tempNodes, "lines": tempLines, "drawLines": tempDrawLine};
    },
    enlargeNode: function (params) {
        let context = window.flowVue,
            nodeInfo = context.nodes[params.nodeId];
        let newPath = Graphic.get(params.nodeName, params.startX, params.startY, params.newWidth, params.newHeight, false);
        nodeInfo.attr({path: newPath.path, x: params.startX, y: params.startY});
        nodeInfo.data("width", params.newWidth);
        nodeInfo.data("height", params.newHeight);
        // 更新连接点的坐标
        let cPoint = params.cPoint;
        let drawLine = context.drawLine;
        for (let key in cPoint) {
            let lineInfo = cPoint[key];
            let side = lineInfo.side;
            let rate = lineInfo.rate;
            let isStart = lineInfo.isStart;
            let nx, ny, id, points, px, py;
            let startX = params.startX, startY = params.startY, width = params.newWidth, height = params.newHeight;
            if (side === 1) {
                nx = startX + width * rate;
                ny = startY;
            } else if (side === 2) {
                nx = startX + width * rate;
                ny = startX + height;
            } else if (side === 3) {
                nx = startX;
                ny = startY + height * rate;
            } else if (side === 4) {
                nx = startX + width;
                ny = startY + height * rate;
            }
            let draw = drawLine[key];
            if (isStart) {
                draw.from.x = nx;
                draw.from.y = ny;
                id = draw.from.id;
                px = draw.end.x;
                py = draw.end.y;
            } else {
                draw.end.x = nx;
                draw.end.y = ny;
                id = draw.end.id;
                px = draw.from.x;
                py = draw.from.y;
            }
            points = CalEnd.calPoint(id, nx, ny, px, py);
            draw["points"] = points;
            if (!isStart) {
                draw.from.x = points[0].x;
                draw.from.y = points[0].y;
                draw.end.x = points[points.length - 1].x;
                draw.end.y = points[points.length - 1].y;
            } else {
                draw.end.x = points[0].x;
                draw.end.y = points[0].y;
                draw.from.x = points[points.length - 1].x;
                draw.from.y = points[points.length - 1].y;
            }

            // let config = draw;
            // config["points"] = points;
            // context.r.drawLine(config);
        }
    }
}