export default {
    // 此方法可以，大量简化
    remove: function (context) {
        let current = context.currentNode,
            nodes = context.data.nodes,
            lines = context.data.lines,
            nodeId = current.data("id"),
            node, line, lineId;
        for (let i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (node.id !== nodeId) {
                continue;
            }
            // 删除节点
            nodes.splice(i, 1);
            // 删除相关联的线条
            for (let j = 0; j < lines.length; j++) {
                line = lines[i];
                if (line.start === nodeId || line.end === nodeId) {
                    lines.splice(j, 1);
                    lineId = line.start + "-" + line.end;
                    context.lines[lineId].remove();
                }
            }
        }
        context.save();
    },
    add: function (node, context) {
        context.data.ids++;
        let id = "i" + context.data.ids;
        node.id = id;
        node.text = "";
        context.nodes[id] = context.r.flowNode(node);
        context.data.nodes.push(node);
        context.save();
    }
}