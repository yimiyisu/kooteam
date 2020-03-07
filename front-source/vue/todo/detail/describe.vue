<template>
    <div class="describe">
        <z-row>
            <z-col :span="1"><i class="ft icon">&#xe75e;</i></z-col>
            <z-col :span="23">
                <div class="title"><strong>描述</strong></div>
                <textarea placeholder="添加详细描述..." @change="change" v-model="value.content"></textarea>
            </z-col>
        </z-row>
    </div>
</template>
<script>
    import Config from "../../util/config"

    export default {
        name: "detailDescribe",
        props: ["value", "type"],
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
            change() {
                let url = '/thing/patch.do';
                if (this.type === 1) {
                    url = "/patch/archive.json"
                }
                $.post({
                    content: this.value.content,
                    _id: this.value._id
                }, url, (reback) => {
                })
            },
            init: function () {
                let domain = Config.uploadDomain();
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