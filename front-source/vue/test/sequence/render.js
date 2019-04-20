import PatchAndQuery from "./util/patchAndQuery"

export default {
    init: function (data, raphael) {
        let nodes = {}, lines = {}, current, lineId, item, drawLines = {},
            context = window.flowVue;
        context.r.clear();
        // 渲染节点
        for (let i = 0; i < data.nodes.length; i++) {
            current = data.nodes[i];
            item = raphael.flowNode(current);
            nodes[current.id] = item;
        }
        context.nodes = nodes;
        // 渲染链接线
        for (let j = 0; j < data.lines.length; j++) {
            current = data.lines[j];
            lineId = current.start + "-" + current.end;
            item = raphael.flowLine(current);
            lines[lineId] = item;
        }
        context.lines = lines;
        // 渲染drawLine
        for (let k = 0; k < data.drawLines.length; k++) {
            current = data.drawLines[k];
            lineId = current.id;
            item = raphael.drawLine(current);
            drawLines[lineId] = item;
        }
        context.drawLine = drawLines;
    },
    addNode: function (x, y, type) {
        let context = window.flowVue;
        if (type === "brokeLine") {
            let id = "draw_" + zen.id();
            let points = [{x: x, y: y}, {x: x, y: y + 50}, {x: x + 100, y: y + 50}, {x: x + 100, y: y + 100}]
            let config = {id: id, points: points, from: {x: x, y: y}, end: {x: x + 100, y: y + 100}};
            context.drawLine[id] = context.r.drawLine(config);
        } else {
            let id = "shape_" + zen.id();
            let config = {x: x, y: y, type: type, id: id, text: "",};
            context.nodes[id] = context.r.flowNode(config);
            context.save();
        }
    },
    remove: function () {
        let context = window.flowVue, current;
        let oldId = window.flowVue.currentTargetId;
        let id;
        for (let key in context.nodes) {
            if (key === oldId) {
                id = context.nodes[key].id;
            }
        }
        for (let key in context.lines) {
            if (key === oldId) {
                id = context.lines[key].line.id;
            }
        }
        if (id) {
            let result = PatchAndQuery.queryPathType(id);
            if (result.type === "line") {
                this.removeLine(result);
                context.save();
            } else if (result.type === "node") {
                for (let key in context.lines) {
                    current = context.lines[key];
                    let lineId = current.line.id;
                    if (current.from.id === id || current.to.id === id) {
                        let lineInfo = PatchAndQuery.queryPathType(lineId);
                        this.removeLine(lineInfo);
                    }
                }
                delete window.flowVue.nodes[result.oldId];
                let nodeDel = context.r.getById(id);
                let gp = nodeDel.data("gp");
                for (let i = 0; i < gp.length; i++) {
                    gp[i].remove();
                }
                nodeDel.remove();
                context.save();
                context.currentNode = null;
                context.currentTargetId = null;
            }
        }
    },
    removeLine: function (lineInfo) {        // 删除线条
        let context = window.flowVue;
        let delPath = context.r.getById(lineInfo.pathId),
            txtId = lineInfo.txtId;
        let delTxt = context.r.getById(txtId);
        delTxt.remove();
        delPath.remove();
        delete window.flowVue.lines[lineInfo.oldId];
        context.currentNode = null;
        context.currentTargetId = null;
    }
}