export default {
    reset: function (data, paper, context) {
        paper.clear();
        this.init(data, paper, context);
    },
    init: function (data, paper, context) {
        let nodes = {},
            lines = {},
            current,
            lineId,
            item,
            startNode,
            toNode;

        // 渲染节点
        for (let i = 0; i < data.nodes.length; i++) {
            current = data.nodes[i];
            item = paper.flowNode(current);
            nodes[current.id] = item;
        }
        if (context) {
            context.nodes = nodes;
        }
        // 渲染链接线
        for (let j = 0; j < data.lines.length; j++) {
            current = data.lines[j];
            lineId = current.start + "-" + current.end;
            startNode = nodes[current.start];
            toNode = nodes[current.end];
            item = paper.flowLine({from: startNode, to: toNode, text: current.text});
            lines[lineId] = item;
        }
        if (context) {
            context.lines = lines;
        }
    }
}