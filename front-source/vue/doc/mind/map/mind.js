import Config from "../util/config"

const textStyle = {fill: "#000", "font-size": 13};


//绘制节点的文本
function renderText(paper, node) {
    let id = "t_" + node.id;
    let text = paper.getById(id);
    if (text) {
        text.attr({text: node.name});
    } else {
        text = paper.text(-200, -200, node.name).attr(textStyle).attr("id", id);
        // text.node.id = id;
        text.id = id;
    }
    return text.getBBox().width + 20;
}


export default {
    height: function (paper, node) {
        let height = 0, child, length;
        if (!node.children) {
            node.children = [];
        }
        if (node.children.length === 0) {
            height = Config.elHeight;
        } else {
            length = node.children.length;
            for (let i = 0; i < node.children.length; i++) {
                child = node.children[i];
                if (child.children) {
                    child = this.height(paper, child);
                    height += child.height;
                } else {
                    height += Config.elHeight;
                    child.top = 0;// 初始位置的标志值，理论值是最高位置
                    child.height = Config.elHeight;
                    child.width = renderText(paper, child);
                }
            }
            height += (length - 1) * Config.elSpaceHeight;
        }
        node.top = 0;// 初始位置的标志值，理论值是最高位置
        node.height = height;
        node.width = renderText(paper, node);// 加上文字两边间距
        return node;
    },
    width: function (paper, node) {
        let width = 0, child, length, widthCount = 0;
        if (!node.children) {
            node.children = [];
        }
        if (node.children.length === 0) { // 如果没有子节点，则宽度等于文本的长度
            width = renderText(paper, node);
            widthCount += width;
        } else {
            length = node.children.length;
            for (let i = 0; i < length; i++) {
                child = node.children[i];
                if (child.children) {
                    child = this.width(paper, child);
                    widthCount += child.widthCount;
                } else {
                    child.top = 0;// 初始位置的标志值，理论值是最高位置
                    child.width = renderText(paper, child);
                    widthCount += child.widthCount;
                }
            }
            widthCount += (length - 1) * Config.elUPSpace;
            width = renderText(paper, node);
        }
        node.top = 0;// 初始位置的标志值，理论值是最高位置
        node.height = Config.elHeight;
        node.width = width;
        node.childWidthCount = widthCount;
        node.widthCount = (widthCount > width) ? widthCount : width; // 节点自身宽度有可能大于子节点总和
        return node;
    }

}