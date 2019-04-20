export default {
    context: null,
    add: function (isSon, context) {
        let current = context.current;
        if (!current) {
            return;
        }
        let relateId = current.id;
        let node = {
            y: 0,
            x: 0,
            top: 0,
            children: [],
            name: "新建节点",
            color: null,
        };
        let data = context.data;
        let id = data.ids++;
        node.id = "i" + id;
        if (relateId === "root") {
            data.children.push(node);
        } else {
            insertNode(relateId, node, data, isSon);
        }
        // 保存节点
        context.save();
    },
    remove: function (context) {
        let current = context.current;
        if (!current) {
            return;
        }
        let id = current.id;
        if (id === "root") {
            return;
        }
        let result = removeNode(id, context.data);
        if (result) {
            context.current = null;
            context.save();
        }
    }
}

function insertNode(relateId, node, parent, isSon) {
    let current;
    for (let i = 0; i < parent.children.length; i++) {
        current = parent.children[i];
        if (current.id === relateId) {
            if (isSon) {
                if (!current.children) {
                    current.children = [];
                }
                current.children.push(node);
            } else {
                parent.children.splice(i, 0, node);
            }
            return true;
        }
        if (current.children && current.children.length > 0) {
            if (insertNode(relateId, node, current, isSon)) {
                return true;
            }
        }
    }
    return false;
}

function removeNode(relateId, parent) {
    let current;
    for (let i = 0; i < parent.children.length; i++) {
        current = parent.children[i];
        if (current.id === relateId) {
            if (current.children.length > 0) {
                alert("请先删除子节点");
                return false;
            }
            parent.children.splice(i, 1);
            return true;
        }
        if (current.children && current.children.length > 0) {
            if (removeNode(relateId, current)) {
                return true;
            }
        }
    }
    return false;
}
