import Line from "../util/line";

export default {
    start: function (ui, context) {
        let currentNode = context.currentNode;
        if (!currentNode) {
            return;
        }
        let bbox = currentNode.getBBox(),
            param = {
                id: currentNode.data("id"),
                x: bbox.x,
                y: bbox.y
            },
            dom = ui.helper;
        if (dom.hasClass("l1")) {
            param.x += bbox.width / 2;
        }
        if (dom.hasClass("l2")) {
            param.x += bbox.width;
            param.y += bbox.height / 2;
        }
        if (dom.hasClass("l3")) {
            param.x += bbox.width / 2;
            param.y += bbox.height;
        }
        if (dom.hasClass("l4")) {
            param.y += bbox.height / 2;
        }
        context.startPoint = param;
    },
    moving: function (ui, context) {
        let startPoint = context.startPoint,
            startId = startPoint.id,
            startNode = context.nodes[startId],
            startBbox = startNode.getBBox(),
            position = ui.position,
            endX = startBbox.x + position.left,
            endY = startBbox.y + position.top + 4;
        let path = Line.temp(startPoint.x, startPoint.y, endX, endY);
        if (!context.tempPath) {
            context.tempPath = context.r.path(path).attr({stroke: "#aaa", fill: "none"});
        } else {
            context.tempPath.attr({path: path});
            context.tempPath.show();
        }
    },
    finish: function (ui, context) {
        if (!context.tempPath) {
            return;
        }
        let startPoint = context.startPoint,
            startId = startPoint.id,
            target = context.currentNode,
            targetId = target.data("id");

        if (targetId === startId) {
            return context.tempPath.hide();
        }
        let lineId = startId + "-" + targetId;
        if (context.lines[lineId]) {
            return;
        }
        let startNode = context.nodes[startId],
            position = ui.position,
            bbox = startNode.getBBox(),
            endX = bbox.x + position.left,
            endY = bbox.y + position.top,
            endBox = target.getBBox();

        // 在目标对象内
        if (endX > endBox.x && endY > endBox.y
            && endX < (endBox.x + endBox.width) && endY < (endBox.y + endBox.height)) {
            let toNode = context.nodes[targetId],
                param = {start: startId, end: targetId, text: ""};
            context.tempPath.hide();
            context.lines[lineId] = context.r.flowLine({from: startNode, to: toNode});
            context.data.lines.push(param);
            // 添加连线后，保存数据
            context.save();
        }
    }
}
