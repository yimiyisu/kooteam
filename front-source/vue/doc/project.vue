<template>
    <div class="z-1" style="background: #fff">
        <Editor v-if="isLoad" :pid="id" :data="data" :summary="content"></Editor>
    </div>
</template>
<script>
    import Editor from "./repository/editor"
    import Config from "./repository/config"

    export default {
        data: function () {
            return {
                isLoad: false,
                id: null,
                data: {},
            }
        },
        components: {Editor},
        mounted: function () {
            this.id = $.getParam("id");
            $.http({id: this.id}, "/project/chapter.do", function (reback) {
                let data = reback.data;
                if (data.content) {
                    this.content = JSON.parse(data.content);
                } else {
                    this.content = Config.initData();
                }
                this.data = {
                    _id: this.id,
                    title: data.title + "-文档"
                };
                this.isLoad = true;
            }, this);
        },
        methods: {
            save: function (result, content, later) {
                if (later === undefined) {
                    later = 3;
                }
                if (!result) {
                    return false;
                }
                let param = {
                    _id: this.id,
                    content: JSON.stringify(content)
                };
                $.http(param, "/project/saveDoc.do", function (reback) {
                    if (later === 0) {
                        $.notice(reback.data, "success");
                    }
                }, this, later);
            }
        }
    }
</script>