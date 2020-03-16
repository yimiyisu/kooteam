<template>
    <div>
        <div class="k-repository">
            <div class="z-row">
                <div class="z-12 h3">
                    {{data.title}}
                </div>
                <div class="z-12" style="text-align: right">
                    <AddDoc class="el-button el-button--small is-plain">新增章节</AddDoc>
                    <!--<span class="z-button primary" @click="saveModel">保存</span>-->
                    <!--<div v-if="readonly">-->
                    <z-link target="_blank" type="button" :href="'/view.html?id='+data._id" size="small">查看</z-link>
                    <!--<z-button plain target="_blank" size="small"-->
                    <!--v-href="'/view.html?id='+data._id">-->
                    <!--查看-->
                    <!--</z-button>-->
                    <!--                    <z-button plain v-if="!pid" size="small" @click="set">设置</z-button>-->
                    <!--<span class="z-button primary" @click="editModel">编辑</span>-->
                    <!--</div>-->
                    <!--<div v-else>-->
                    <z-wicket plain action="/note/patch.do" wicket-size="small" :prop="data" view="J_title"
                              :callback="changeTitle">修改标题
                    </z-wicket>
                    <Set :permision="data.permision" :note="data._id" v-if="!pid">设置</Set>
                </div>
            </div>
            <z-scrollbar :height="-180">
                <Chapter class="chapter-list" key="root" :value="summary.sons" :readonly="readonly"></Chapter>
            </z-scrollbar>
        </div>
        <Board :itemId="docId" :nodes="summary.sons"></Board>
    </div>

</template>
<script>
    import Chapter from "./chapter"
    import AddDoc from "./addDoc"
    import Board from "./board"
    import Set from "./set"

    export default {
        props: ["data", "summary", "pid"],
        components: {Chapter, AddDoc, Board, Set},
        data() {
            return {
                showSet: false,
                readonly: false,
                docId: null
            }
        },
        provide() {
            return {repository: this}
        },
        mounted() {
            $.on("chapterEvt", this.subscribe);
            let doc = $.getParam("docId");
            if (!doc) {
                return;
            }
            this.docId = doc;
        },
        destory() {
            $.off("chapterEvt");
        },
        methods: {
            // 删除节点
            remove(id, parent, isMove) {
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
            // 添加子节点
            add(id, parent, item, isSon) {
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
            edit(params, parent) {
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
            move(params) {
                let item = this.remove(params.from, this.summary.sons, true);
                let data = $.extend({}, item, false);
                return this.add(params.to, this.summary.sons, data, params.isSon);
            },
            subscribe(params) {
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
                // 编辑文档
                result = this.edit(params, parent.sons);
                this.save(result);
            },
            cancel() {
                this.readonly = true;
            },
            changeTitle(reback) {
                this.data.title = reback.data.title;
            },
            save() {
                let param = {
                    _id: this.data._id,
                    content: JSON.stringify(this.summary)
                };
                $.post(param, "/note/patch.do", function (reback) {
                }, this);
            }
        }
    }
</script>