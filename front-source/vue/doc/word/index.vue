<template>
    <div>
        <MD v-if="isMD" :readonly="readonly" :value="item" :emitSave="emitSave"></MD>
        <Rich v-else :readonly="readonly" :value="item" :emitSave="emitSave"></Rich>
    </div>
</template>
<script>
    import Rich from "./rich"
    import MD from "./markdown"

    export default {
        props: ["readonly", "value", "emitSave"],
        components: {Rich, MD},
        data: function () {
            return {
                isMD: false,
                item: null
            }
        },
        created: function () {
            this.item = this.value;
            let mode = window.localStorage["editorMode"];
            // 判断是否有本地设置
            if (mode === "md") {
                this.isMD = true;
            }
        },
        methods: {
            save: function (content, isAuto) {
                let val = this.value;
                let param = {
                    _id: this.value._id,
                    title: val.title,
                    content: content
                };
                if (!param.title) {
                    param.title = "新建文章标题";
                }
                let later = 0;
                if (isAuto) {
                    later = 15;
                }
                $.http(param, "/note/patch.do", function (reback) {
                    $.notice(reback.data, "success");
                    this.item.content = content;
                }, this, later);
            }
        }
    }
</script>