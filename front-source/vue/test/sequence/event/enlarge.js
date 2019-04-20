import PatchAndQuery from "../util/patchAndQuery"
import Render from "../render"

const nodeParams = {    // 增加图形时，在以下常量中增加参数即可
    circle: {widthMin: 72, heightMin: 72, type: 1},
    angle4: {widthMin: 72, heightMin: 72, type: 1},
    rect: {widthMin: 80, heightMin: 48, type: 2},
    ellipse: {widthMin: 80, heightMin: 48, type: 3},
    shape_1: {widthMin: 80, heightMin: 48, type: 2},
    shape_2: {widthMin: 80, heightMin: 48, type: 2},
};// type 1 代表宽高必须相等（圆形，菱形）  type 2 代表宽高可以不相等（矩形，文本框）  type 3  代表 宽度必须大于或等于高度
const exlen = 10;
export default {
    start: function (x, y, evt) {
        evt.stopPropagation();
        this.ox = this.data("start").x;
        this.oy = this.data("start").y;
        let id = this.data("nodeId");
        let width = this.data("width");
        let height = this.data("height");
        // 保存原有信息，并且计算连接点距离端点的比例
        let context = window.flowVue, line, oLine = {};
        let nodeInfo = context.nodes[id];
        let nodeX = nodeInfo.attrs.x;
        let nodeY = nodeInfo.attrs.y;


        for (let key in context.drawLine) {
            line = context.drawLine[key];
            if (line.from.id === id || line.end.id === id) {
                let px, py, dLen, rate, mark, oLineInfo = {}, isStart;  // 1 2 3 4 分别代表 上下左右
                if (line.from.id === id) {
                    px = line.from.x;
                    py = line.from.y;
                    isStart = true;
                }
                if (line.end.id === id) {
                    px = line.end.x;
                    py = line.end.y;
                    isStart = false;
                }
                if (nodeX === px) {
                    dLen = py - nodeY;
                    mark = 3;
                    rate = dLen / height;
                }
                if (nodeY === py) {
                    dLen = px - nodeX;
                    mark = 1;
                    rate = dLen / width;
                }
                if ((nodeX + width) === px) {
                    dLen = py - nodeY;
                    mark = 4;
                    rate = dLen / height;
                }
                if ((nodeY + height) === py) {
                    dLen = px - nodeX;
                    mark = 2;
                    rate = dLen / width;
                }
                oLineInfo["side"] = mark;
                oLineInfo["rate"] = rate;
                oLineInfo["isStart"] = isStart;
                oLineInfo["line"] = line;
                oLine[key] = oLineInfo;
            }
        }
        this.oLine = oLine;
    },
    moving: function (dx, dy, x, y) {
        let att = {x: this.ox + dx, y: this.oy + dy};
        let nx = att.x, ny = att.y;
        let gp = this.data("gp"),
            nodeId = this.data("nodeId"),
            start = this.data("start"),
            nodeName = this.data("nodeName"),
            nodeWidth = this.data("width"),
            nodeHeight = this.data("height"),
            pointName = this.data("pointName"),
            startX = start.x,
            startY = start.y,
            width = Math.abs(x - startX),
            height = Math.abs(y - startY),
            newWidth, newHeight;
        // 计算宽高，
        if (pointName === 5) {
            width = Math.abs(x - startX);
            height = Math.abs(y - startY);
        } else if (pointName === 6) {
            width = Math.abs(x - startX);
            height = Math.abs(startY + nodeHeight - y + 70);
        } else if (pointName === 7) {
            width = Math.abs(startX + nodeWidth - x);
            height = Math.abs(startY + nodeHeight - y + 70);
        } else if (pointName === 8) {
            width = Math.abs(startX + nodeWidth - x);
            height = Math.abs(y - startY);
        }
        let paramMin = nodeParams[nodeName];
        // 不同类型的图形，其宽高的最小值不同，重新计算
        if (paramMin.type === 1) {
            let newR = (width < height) ? width : height;   //  半径取两者的较小值
            newWidth = (newR < paramMin.widthMin) ? paramMin.widthMin : (newR);
            newHeight = (newR < paramMin.heightMin) ? paramMin.heightMin : (newR);
        } else if (paramMin.type === 2) {
            height = height - 60;
            newWidth = (width < paramMin.widthMin) ? paramMin.widthMin : (width);
            newHeight = (height < paramMin.heightMin) ? paramMin.heightMin : (height);
        } else if (paramMin.type === 3) {
            height = height - 60;
            newWidth = (width < paramMin.widthMin) ? paramMin.widthMin : (width);
            newHeight = (height < paramMin.heightMin) ? paramMin.heightMin : (height);
            newHeight = (newWidth < newHeight) ? newWidth : newHeight;
        }

        let dh, dw, newStartX, newStartY;
        dh = newHeight - nodeHeight;
        dw = newWidth - nodeWidth;
        // 重新计算放大之后，图形的起点位置
        if (pointName === 5) {
            newStartX = startX;
            newStartY = startY;
        } else if (pointName === 6) {
            newStartX = startX;
            newStartY = startY - dh;
        } else if (pointName === 7) {
            newStartX = startX - dw;
            newStartY = startY - dh;
        } else if (pointName === 8) {
            newStartX = startX - dw;
            newStartY = startY;
        }

        let params = {
            nodeId: nodeId,
            nodeName: nodeName,
            newWidth: newWidth,
            newHeight: newHeight,
            pointName: pointName,
            nodeWidth: nodeWidth,
            nodeHeight: nodeHeight,
            startX: newStartX,
            startY: newStartY,
            cPoint: this.oLine,
        };
        PatchAndQuery.enlargeNode(params);

        let newData = PatchAndQuery.patchData();
        Render.init(newData, window.flowVue.r);  // 实时刷新页面元素
    },
    end: function () {
        window.flowVue.save("render");
    },
}