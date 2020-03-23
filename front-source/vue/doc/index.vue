<template>
    <z-row class="k-doc" type="flex" justify="space-between">
        <z-col :span="4">
            <h3>
                我的知识库
                <Search></Search>
            </h3>
            <z-scrollbar :height="-150">
                <z-list url="/note/my.do" id="J_docList" :callback="callback">
                    <template #default="item">
                        <div class="doc-item" :class="{'active':current._id===item._id}"
                             @click="select(item,$event)" :key="item._id">{{item.title}}
                            <div class="time">
                                {{item._id|idate}}
                                <z-execute type="text" tip="确定删除吗？"
                                           :action="'/note/remove.do?_id='+item._source"><i class="ft icon">&#xe8f8;</i>
                                </z-execute>
                            </div>
                        </div>
                    </template>
                </z-list>
            </z-scrollbar>
        </z-col>
        <z-col :span="20">
            <Editor v-if="content" :data="current" :summary="content"></Editor>
        </z-col>
    </z-row>
</template>
<script>
    import Editor from "./repository/index"
    import Config from "./repository/config"
    import Search from "./search"

    export default {
        data: function () {
            return {
                content: null,
                current: null
            }
        },
        components: {Editor, Search},
        created() {
            $.on("docSave", this.save);
        },
        destory() {
            $.off("docSave");
        },
        methods: {
            select: function (item) {
                if (this.current && this.current._id === item._id) {
                    return;
                }
                this.current = item;
                this.loadContent(item._id, Config.initData());
                let href = $.setParam("rid", item._id);
                window.history.replaceState(null, null, href);
            },
            callback(data) {
                if (data.total === 0) {
                    return;
                }
                let list = data.list;
                if (list.length === 0) {
                    this.content = null;
                    return this.current = null;
                }
                if (this.current && this.current._id === list[0]._id) {
                    return;
                }
                this.select(list[0]);
            },
            save: function (result, content, later) {
                if (!result) {
                    return false;
                }
                if (later === undefined) {
                    later = 3;
                }
                let param = {
                    _id: this.current._id,
                    content: JSON.stringify(content)
                };
                $.post(param, "/note/patch.do", function (reback) {
                    $.notice("保存成功！", "success")
                }, this, later);
            },
            loadContent: function (chapterId, defData) {
                if (!chapterId) {
                    return;
                }
                $.post({_id: chapterId}, "/get/noteContent.json", function (reback) {
                    let data = reback.data;
                    if (data.content) {
                        this.content = JSON.parse(data.content);
                    } else {
                        this.content = defData;
                    }
                }, this);
            }
        }
    }
</script>