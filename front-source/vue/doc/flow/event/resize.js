export default {
    moving: function (ui, context) {
        let current = context.currentNode,
            position = ui.position, size = ui.size,
            nodeId = current.data("id"),
            node = context.getNode(nodeId);

        node.x = position.left;
        node.y = position.top;
        node.width = size.width;
        node.height = size.height;
        // 同步调整文本文件距离
        context.r.flowNode(node, context.nodes[nodeId]);
        context.rerenderLines(nodeId);
    },
    finish: function (context) {
        let current = context.currentNode,
            id = current.data("id"),
            bbox = current.getBBox();
        let node = context.getNode(id);
        if (!node) {
            return;
        }
        node.x = bbox.x;
        node.y = bbox.y;
        node.width = bbox.width;
        node.height = bbox.height;
        context.save();
    }
}