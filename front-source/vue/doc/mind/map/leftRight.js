// 左右分布图形
import Color from "../../../util/colors";
import Path from "../util/path";
import Config from "../util/config"

const elSpaceWidth = 100;     //                宽 elements-spacting-width  elsWidth

// 计算节点坐标 左右分布
function calPosition(node, parent, isLeft) {
    if (isLeft) {
        node.x = parent.x - elSpaceWidth - node.width;
        node.left = isLeft;
    } else {
        node.x = parent.x + elSpaceWidth + parent.width;
        node.left = isLeft;
    }
    if (!node.color) { //添加节点样式
        node.color = parent.color;
    }
    if (!parent.top) {// 如果未初始化，则开始赋值
        parent.top = parent.y - parent.height / 2;
    }
    node.y = parent.top + node.height / 2;
    if (parent.id === "root") {            //  特殊情况  父级为跟节点
        let grapType = parent.grapType;
        let childLen = parent.children.length;
        if (grapType === 1) {
            if (childLen > 2) {
                if (isLeft) {
                    childLen = childLen + 1;
                }
                node.y = node.y - (Math.floor(childLen / 2) - 1) * Config.elSpaceHeight / 2;
            }
        } else if (grapType === 2 || grapType === 3) {
            node.y = node.y - (childLen - 1) * Config.elSpaceHeight / 2;
        }
    }
    parent.top += node.height + Config.elSpaceHeight;// 计算完后，加上y坐标的值
    if (!node.children || node.children.length === 0) {
        return node;
    }
    for (let i = 0; i < node.children.length; i++) {
        node.children[i] = calPosition(node.children[i], node, isLeft);
    }
    return node;
}

// 绘制节点间线条  左右分布
function calLine(node, parent, isLeft, paper, lineType) {
    let startX, startY, endX, endY;
    if (isLeft) {// 左边节点
        startX = parent.x;
        endX = node.x + node.width;
    } else {
        startX = parent.x + parent.width;
        endX = node.x;
    }
    startY = parent.y + Config.elHeight / 2;
    endY = node.y + Config.elHeight / 2;

    let path;
    if (lineType === 1) {
        path = Path.pathZ(startX, startY, endX, endY, isLeft);                   // 连接线为折线
    }
    if (lineType === 2) {
        path = Path.pathC(startX, startY, endX, endY, isLeft, elSpaceWidth);  // 连接线为曲线
    }
    paper.mindLine(node.id, path);

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            calLine(node.children[i], node, isLeft, paper, lineType);
        }
    }
}

export default function (rootNode, leftCount, paper) {
    rootNode.top = 0;
    if (!rootNode.color) {
        rootNode.color = Color[Color.length - 1];
    }
    // 计算左边节点
    let height = 0, i, themeId, child, lineType = parseInt(rootNode.lineType);
    for (i = 0; i <= leftCount; i++) {
        child = rootNode.children[i];
        height += child.height;
        if (!child.color) {
            themeId = i % Color.length;
            child.color = Color[themeId];
        }
    }
    rootNode.height = height;// 计算根节点左边高度

    for (i = 0; i <= leftCount; i++) {
        calPosition(rootNode.children[i], rootNode, true);
        calLine(rootNode.children[i], rootNode, true, paper, lineType);
    }

    // 计算右边节点
    leftCount++;
    height = 0;
    for (i = leftCount; i < rootNode.children.length; i++) {
        child = rootNode.children[i];
        height += child.height;
        if (!child.color) {
            themeId = i % Color.length;
            child.color = Color[themeId];
        }
    }
    rootNode.top = 0;
    rootNode.height = height;// 计算根节点右边边高度
    for (i = leftCount; i < rootNode.children.length; i++) {
        calPosition(rootNode.children[i], rootNode, false);
        calLine(rootNode.children[i], rootNode, false, paper, lineType);
    }
    return rootNode;
}