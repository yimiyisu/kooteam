<template>
    <div class="k-doc z-row">
        <div class="z-4">
            <h3>我的知识库
                <z-wicket type="text" class="new" size="small" view="J_new" action="/note/add.do" title="新建知识库"><i
                        class="z-icon hover">&#xe145;</i></z-wicket>
            </h3>
            <Tree></Tree>
        </div>
        <div class="z-20">
            <Editor v-if="content" :data="chapterData" :summary="content"></Editor>
        </div>
    </div>
</template>
<script>
    import Editor from "./repository/editor"
    import Config from "./repository/config"
    import Tree from "./tree"

    export default {
        data: function () {
            return {
                chapterData: {},
                content: null,
                value: null,
            }
        },
        watch: {
            value: function (val) {
                if (!val) {
                    return;
                }
                this.chapterData = val;
                this.loadContent(val._id, Config.initData());
            }
        },
        components: {Editor, Tree},
        methods: {
            save: function (result, content, later) {
                if (!result) {
                    return false;
                }
                if (later === undefined) {
                    later = 3;
                }
                let param = {
                    _id: this.chapterData._id,
                    content: JSON.stringify(content)
                };
                $.http(param, "/note/patch.do", function (reback) {
                    if (reback.action === 0) {
                        $.notice(reback.data, "success");
                    }
                }, this, later);
            },
            loadContent: function (chapterId, defData) {
                if (!chapterId) {
                    return;
                }
                $.http({_id: chapterId}, "/extend/note.json", function (reback) {
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