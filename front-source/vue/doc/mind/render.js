import MindMap from "./map/mind"
import LeftRight from "./map/leftRight"
import UpDown from "./map/upDown"
import Config from "./util/config"


function renderNode(paper, node, shape) {
    let children = node.children;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            renderNode(paper, children[i], shape);
        }
    }
    paper.mindNode(node, shape, paper);
}

// 支持多种思维导图渲染引擎
export default {
    reset: function (data, paper) {
        paper.clear();
        this.init(data, paper);
    },
    init: function (data, paper) {
        // 1 左右分布  2 右侧分布  3 左侧分布  4 上下分布 5 下面分布  6 上面分布
        let grapType = parseInt(data.grapType), canvasSize = Config.cavasSize;
        let rootNode, count; // count 是用于统计分布在 左侧 或者 上面 节点个数

        if (grapType === 1 || grapType === 4) {
            count = data.children.length / 2;
            if (count % 1 === 0) {
                count -= 1;
            } else {
                count = Math.floor(count);
            }
        } else if (grapType === 2 || grapType === 5) {
            count = -1;
        } else if (grapType === 3 || grapType === 6) {
            count = data.children.length - 1;
        }
        if (grapType === 1 || grapType === 2 || grapType === 3) {// 左右分布
            rootNode = MindMap.height(paper, data);
            rootNode.x = canvasSize / 2;
            rootNode.y = canvasSize / 2;
            LeftRight(rootNode, count, paper);// 计算节点位置与高度
        } else if (grapType === 4 || grapType === 5 || grapType === 6) {// 上下分布
            rootNode = MindMap.width(paper, data);
            rootNode.x = canvasSize / 2;
            rootNode.y = canvasSize / 2;
            UpDown(rootNode, count, paper);// 计算节点位置与高度
        }
        // 重置画布尺寸
        renderNode(paper, rootNode, data.shape);
    }
}