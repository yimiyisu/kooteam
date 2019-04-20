export default {
    moving: function (ui, context) {
        let target = context.currentNode,
            txtNode = target.data("txt"),
            position = ui.position;

        let bbox = target.getBBox(),
            att = {
                x: position.left,
                y: position.top
            },
            width = bbox.width,
            height = bbox.height,
            deltaX = position.left - bbox.x,
            deltaY = position.top - bbox.y;
        target.attr(att);
        target.translate(deltaX, deltaY);

        // 更新文本位置
        if (txtNode) {
            txtNode.attr({x: att.x + width / 2, y: att.y + height / 2});
        }
        // 同步更新线条
        context.rerenderLines(target.data("id"));
    },
    finish: function (context) {// 更新节点数据，对象
        let current = context.currentNode,
            id = current.data("id"),
            bbox = current.getBBox();
        let node = context.getNode(id);
        if (!node) {
            return;
        }
        node.x = bbox.x;
        node.y = bbox.y;
        context.save();
    }
}