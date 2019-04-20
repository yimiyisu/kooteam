export default {
    ids: 4,
    nodes: [
        {
            x: 300, y: 50, type: "angle4",
            width: 180,
            height: 72,
            color: "#f80e15",
            id: "angel4", text: "菱形"
        }
        , {
            x: 900, y: 50, type: "ellipse",
            width: 80,
            height: 48,
            color: "#E7C004",
            id: "ellipse", text: "椭圆"
        }
        ,
        {
            x: 300, y: 280, type: "rect",
            width: 80,
            height: 48,
            color: "#009fe3",
            id: "rect", text: "矩形"
        }, {
            x: 550, y: 200, type: "circle",
            width: 72,
            height: 72,
            color: "#79aa1c",
            id: "circle", text: "圆形"
        }
    ],
    lines: [
        {start: "angel4", end: "circle", text: "连线"},
        {start: "ellipse", end: "circle", text: ""},
        {start: "rect", end: "circle", text: "连线"}
    ]
}