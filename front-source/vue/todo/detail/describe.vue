<template>
    <div class="describe">
        <textarea></textarea>
        <!--<div class="k-attach">-->
        <!--<i class="z-icon hover" v-tip="'关联文档'">&#xe2bc;</i>-->
        <!--<i class="z-icon hover" v-tip="'添加附件'">&#xe2c3;</i>-->
        <!--</div>-->
    </div>
</template>
<script>
    import Config from "../../util/config"

    export default {
        props: ["content"],
        data: function () {
            return {
                thing: null,
                localEmit: false
            }
        },
        mounted: function () {
            // $.lib(["/note/simditor.css", "/note/simditor.min.js"],
            //     this.init, null, this);
        },
        methods: {
            init: function () {
                let domain = Config.uploadDomain();
                // Simditor.locale = 'zh-CN';
                let toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'alignment'];
                this.editor = new Simditor({
                    textarea: $("textarea", this.$el),
                    placeholder: '这里输入待办描述...',
                    defaultImage: Config.resDomain() + '/zeto/preview.png',
                    params: {},
                    tabIndent: true,
                    toolbar: toolbar,
                    toolbarFloat: false,
                    toolbarFloatOffset: 0,
                    height: "200px",
                    toolbarHidden: false,
                    pasteImage: true,
                    cleanPaste: true,
                    upload: {
                        url: domain + "/upload/image.do",
                        fileKey: "file"
                    }
                });
                this.editor.uploader.on("uploadsuccess", function (evt, file, result) {
                    let data = JSON.parse(result);
                    if (data.action === 23) {
                        return alert(data.message);
                    }
                    file.img.attr("src", data.data);
                });
                let that = this;
                if (this.content !== undefined) {
                    that.editor.setValue(this.content);
                }
                that.editor.on("valuechanged", function () {
                    that.localEmit = true;
                    that.$parent.item.content = that.editor.getValue();
                });
            }
        }
    }
</script>