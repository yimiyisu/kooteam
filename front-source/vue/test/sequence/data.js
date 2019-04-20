export default {
    data: {
        drawLines: [{
            id: "line-1",
            text: "这是连接线",                               // 文本
            from: {id: "", x: "", y: ""},
            end: {id: "", x: "", y: ""},
            points: [{x: 150, y: 100}, {x: 150, y: 200}],   // 折线路径坐标
            lineStyle: {
                from: "1",                                  // 起点类型：1 无箭头、 2 有箭头、 3 圆点
                end: "2",
                lineType: "1"                               // 线条类型：1 实线、 2 虚线
            },
        },],
        nodes: [{
            id: "node-1",
            text: "这是节点",
            type: "circle",
            color: "",
            width: 72,
            height: 48,
            x: 120,
            y: 150,
        },],
    }
}