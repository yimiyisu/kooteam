export default {
    queryNodeById: function (id, node) {  // 判断是否有子节点时用到该方法
        if (node.id === id) {
            return node;
        }
        let children = node.children, result;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                result = this.queryNodeById(id, children[i]);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
}