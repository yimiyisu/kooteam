// 上下分布图形
import Color from "../../../util/colors";
import Path from "../util/path";
import Config from "../util/config"

const elUpHeight = 50;        //  上下分布时节点之间的高度

// 计算节点坐标  上下分布
function calPositionType2(node, parent, isUP) {
    if (isUP) {
        node.y = parent.y - Config.elHeight - elUpHeight;
    } else {
        node.y = parent.y + Config.elHeight + elUpHeight;
    }
    if (!node.color) { //添加节点样式
        node.color = parent.color;
    }
    if (!parent.top) {// 如果未初始化，则开始赋值
        if (parent.widthCount > parent.childWidthCount) {
            parent.top = parent.x + parent.width / 2 - parent.childWidthCount / 2;
        } else {
            parent.top = parent.x + parent.width / 2 - parent.widthCount / 2;
        }
    }
    node.x = parent.top + node.widthCount / 2 - node.width / 2;

    if (parent.id === "root") {            //  特殊情况  父级为根节点
        let grapType = parent.grapType;
        let childLen = parent.children.length;
        if (grapType === "4") {
            if (childLen > 2) {
                if (isUP) {
                    childLen = childLen + 1;
                }
                node.x = node.x - (Math.floor(childLen / 2) - 1) * Config.elUPSpace / 2;
            }
        } else if (grapType === "5" || grapType === "6") {
            node.x = node.x - (childLen - 1) * Config.elUPSpace / 2;
        }
    }
    parent.top += node.widthCount + Config.elUPSpace;// 计算完后，加上y坐标的值
    if (!node.children || node.children.length === 0) {
        return node;
    }
    for (let i = 0; i < node.children.length; i++) {
        node.children[i] = calPositionType2(node.children[i], node, isUP);
    }
    return node;
}

// 绘制节点间线条  上下分布
function calLineType2(node, parent, isUP, paper, lineType) {
    let startX, startY, endX, endY;
    startX = parent.x + parent.width / 2;
    endX = node.x + node.width / 2;
    if (isUP) {
        startY = parent.y;
        endY = node.y + Config.elHeight;
    } else {
        startY = parent.y + Config.elHeight;
        endY = node.y;
    }
    let path;
    path = Path.pathZType2(startX, startY, endX, endY, isUP);                   // 连接线为折线
    if (lineType === 1) {
        path = Path.pathZType2(startX, startY, endX, endY, isUP);                   // 连接线为折线
    } else if (lineType === 2) {
        path = Path.pathCType2(startX, startY, endX, endY, isUP, Config.elUPSpace);  // 连接线为曲线
    }

    paper.mindLine(node.id, path);

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            calLineType2(node.children[i], node, isUP, paper, lineType);
        }
    }
}


export default function (rootNode, upCount, paper) {
    rootNode.top = 0;
    if (!rootNode.color) {
        rootNode.color = Color[Color.length - 1];
    }
    // 计算上边节点
    let widthCount = 0, i, themeId, child, lineType = parseInt(rootNode.lineType);
    for (i = 0; i <= upCount; i++) {
        child = rootNode.children[i];
        widthCount += child.widthCount;
        if (!child.color) {
            themeId = i % Color.length;
            child.color = Color[themeId];
        }
    }
    rootNode.widthCount = widthCount;
    for (i = 0; i <= upCount; i++) {
        calPositionType2(rootNode.children[i], rootNode, true);
        calLineType2(rootNode.children[i], rootNode, true, paper, lineType);
    }
    // 计算下边节点
    upCount++;
    widthCount = 0;
    for (i = upCount; i < rootNode.children.length; i++) {
        child = rootNode.children[i];
        widthCount += child.widthCount;
        if (!child.color) {
            themeId = i % Color.length;
            child.color = Color[themeId];
        }
    }
    rootNode.top = 0;
    rootNode.widthCount = widthCount;// 计算根节点右边边高度
    for (i = upCount; i < rootNode.children.length; i++) {
        calPositionType2(rootNode.children[i], rootNode, false);
        calLineType2(rootNode.children[i], rootNode, false, paper, lineType);
    }
}