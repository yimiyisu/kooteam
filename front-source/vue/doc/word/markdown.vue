<template>
    <div class="k-md" id="J_md">
        <textarea class="hide"></textarea>
        <label class="uploadImage hide">
            <input @change="selectFile" type="file"/>
        </label>
    </div>
</template>
<script>

    export default {
        props: ["value", "readonly", "emitSave"],
        data: function () {
            return {
                isShow: false,
                fileDom: null,
                editor: null
            }
        },
        watch: {
            value: function (val) {
                this.editor.value(val.content);
            },
            emitSave: function (val) {
                if (!val) {
                    return;
                }
                let content = this.editor.value();
                this.$parent.save(content);
            }
        },
        mounted: function () {
            this.fileDom = $(".uploadImage", this.$el);
            $.lib(["/note/markdown.css", "/note/markdown.js"], this.init);
        },
        methods: {
            init: function () {
                let textarea = $("textarea", this.$el).el;
                this.editor = new mdEditor({
                    element: textarea[0],
                    spellChecker: false,
                    saveDoc: this.$parent.save,
                    changeModel: this.changeMode,
                    uploadImage: this.image,
                    status: false
                });
                this.editor.value(this.value.content);
            },
            image: function (editor) {
                this.fileDom.trigger("click");
                this.isShow = true;
            },
            toggle: function () {
                this.isShow = !this.isShow;
            },
            selectFile: function () {
                let data = new window.FormData,
                    that = this,
                    xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            let response = xhr.responseText;
                            let result = JSON.parse(response);
                            if (result.action === 4) {
                                return alert("登录已失效");
                            }
                            if (result.action === 23) {
                                return alert(result.message);
                            }
                            that.insertImage(result.data);
                            $("input", that.fileDom).val("");
                        }
                    }
                };
                let file = $("input", this.fileDom)[0].files[0];
                if (!file) {
                    return;
                }
                data.append("file", file);
                let uploadURL = Config.uploadDomain() + "/upload/image.do";
                xhr.open("POST", uploadURL, true);
                xhr.send(data)
            },
            insertImage: function (imageURL) {
                this.editor.insertImage(imageURL);
            },
            changeMode: function () {
                this.$parent.isMD = false;
                window.localStorage["editorMode"] = "rich";
            }
        }
    }
</script>