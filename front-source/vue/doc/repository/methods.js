export default {
    set: function () {
        // this.showSet = true;
        return $.emit("docSet", true);
    },
    // 删除节点
    remove: function (id, parent, isMove) {
        let current, item;
        for (let i = 0; i < parent.length; i++) {
            current = parent[i];
            if (current.id === id) {
                if (!isMove && current.sons.length > 0) {
                    alert("删除失败，请先删除子文档。");
                    return null;
                }
                item = parent.splice(i, 1);
                return item[0];
            }
            if (current.sons && current.sons.length > 0) {
                item = this.remove(id, current.sons, isMove);
                if (item) {
                    return item;
                }
            }
        }
        return null;
    },
    addNode: function () {
        let item = {
            "title": "新增文档",
            "link": "",
            "date": "",
            "sons": []
        };
        this.summary.id++;
        item.id = this.summary.id;
        this.summary.sons.push(item);
        this.save(true);
    },
    // 添加子节点
    add: function (id, parent, item, isSon) {
        let current, result;
        for (let i = 0; i < parent.length; i++) {
            current = parent[i];
            if (current.id === id) {
                if (isSon) {
                    current.sons.unshift(item);
                } else {
                    parent.splice(i, 0, item);
                }
                return true;
            }
            if (current.sons && current.sons.length > 0) {
                result = this.add(id, current.sons, item, isSon);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    },
    // 编辑节点内容
    edit: function (params, parent) {
        let current, result;
        for (let i = 0; i < parent.length; i++) {
            current = parent[i];
            if (current.id !== params.data) {
                if (current.sons && current.sons.length > 0) {
                    result = this.edit(params, current.sons);
                    if (result) {
                        return true;
                    }
                }
                continue;
            }
            if (params.event === "folder") {
                current.status = !current.status;
                return false;
            }
            if (params.event === "edit") {
                current.link = params.link;
                // 默认文档展开
                if (params.link === "folder") {
                    current.status = true;
                }
                current.title = params.title;
                current.uid = params.uid;
                if (params.type) {
                    current.type = params.type;
                }
            }
            // 更新标题
            if (params.event === "title") {
                if (current.title === params.title) {
                    return false;
                }
                current.title = params.title;
            }
            return true;
        }
        return false;
    },
    // 移动节点
    move: function (params) {
        let item = this.remove(params.from, this.summary.sons, true);
        let data = $.extend({}, item, false);
        return this.add(params.to, this.summary.sons, data, params.isSon);
    },
    subscribe: function (params) {
        let result, parent = this.summary;
        if (params.event === "move") {
            result = this.move(params);
            return this.save(result);
        }
        // 添加子章节
        if (params.event === "add") {
            let item = {
                "title": "新增文档",
                "link": "",
                "date": "",
                "sons": []
            };
            parent.id++;
            item.id = parent.id;
            params.data.sons.push(item);
            return this.save(true);
        }
        if (params.event === "remove") {
            result = this.remove(params.data.id, parent.sons);
            return this.save(result);
        }

        if (params.event === "save") {
            return this.save(true);
        }

        // 打开文档
        if (params.event === "doc") {
            return this.docId = params.data;
        }
        // 新建文档
        if (params.event === "newDoc") {
            return $.emit("showAddDocBox", true, params);
        }
        // 编辑文档
        result = this.edit(params, parent.sons);
        this.save(result);
    },
    saveModel: function () {
        this.readonly = true;
        this.$parent.save(true, this.summary, 0);
    },
    cancel: function () {
        this.readonly = true;
    },
    editModel: function () {
        this.readonly = false;
    },
    changeTitle: function (reback, instance) {
        this.data.title = $("input[name='title']", instance.$el).val();
        instance.destory();
    },
    save: function (result) {
        this.$parent.save(result, this.summary);
    }
}