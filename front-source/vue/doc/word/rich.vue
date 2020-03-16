<template>
    <div>
        <div v-show="readonly" class="k-rich-content">
            <div class="content">
                <div class="title">{{item.title}}</div>
                <div v-html="item.content"></div>
            </div>
        </div>
        <div v-show="!readonly" class="k-rich">
            <textarea id="J_Editor" :value="item.content" name="content" class="hide"></textarea>
            <label id="J_uploadFile001" class="hide">
                <input type="file"/>
            </label>
        </div>
    </div>
</template>
<script>
    import Config from "../../util/config"

    export default {
        props: ["value", "readonly", "emitSave"],
        data: function () {
            return {
                editor: null,
                isChange: false,
                item: {}
            };
        },
        watch: {
            value: function (val) {
                this.item = val;
            },
            readonly: function (val) {
                if (!val) {
                    this.initEditor();
                }
            },
            emitSave: function (val) {
                if (!val) {
                    return;
                }
                this.save();
            }
        },
        mounted: function () {
            this.item = this.value;
            let viewHeight = $(window).height() - 50;
            $(".k-rich-content", this.$el).css("height", viewHeight + "px");
            if (!this.readonly) {
                this.initEditor();
            }
        },
        destroyed: function () {
            // 修复编辑器二次渲染的异常
            this.editor.destroy();
        },
        methods: {
            initEditor: function () {
                $.lib(["tinymce/tinymce.min.js"], this.init);
            },
            init: function () {
                let that = this;
                let uploadURL = Config.uploadDomain() + "/upload/image.do";
                tinymce.init({
                    selector: "#J_Editor",
                    statusbar: false,
                    menubar: false,
                    auto_focus: true,
                    language: 'zh_CN',
                    body_class: "article-body",
                    plugins: [
                        'advlist autolink lists link image charmap emoticons anchor',
                        'searchreplace visualblocks',
                        'insertdatetime media table paste'
                    ],
                    images_upload_url: uploadURL,
                    automatic_uploads: false,
                    toolbar: ' undo redo | formatselect | bold italic forecolor backcolor | copy paste cut image link table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat ',
                    save_enablewhendirty: true,
                    save_onsavecallback: function () {
                        that.save();
                    },
                    init_instance_callback: function (editor) {
                        // editor.on('Change', function () {
                        //     that.save();
                        // });
                        editor.addShortcut("meta+s", "", function () {
                            that.save();
                        });
                    }
                }).then(function (editors) {
                    that.editor = editors[0];
                    // 加载默认模版
                    that.template();
                });
            },
            // 加载markdown 模块
            template() {
                $.http({_id: this.item._id}, '/note/get.do', (reback) => {
                    this.editor.setContent(reback.data.content);
                }, this);
                let i = 0;
                let addMd = () => {
                    i++;
                    let toolGroup = $('.tox-toolbar__group').el;
                    if (toolGroup.length > 0) {
                        let el = document.createElement('div');
                        el.className = 'tox-toolbar__group';
                        el.innerHTML = '<button class="tox-tbtn markdown">Md</button>';
                        $('.tox-toolbar__group').el[0].before(el);

                        el.addEventListener('click', () => {
                            this.$parent.isMD = true;
                        }, false); //鼠标单击的时候调用showMes这个函数
                    } else {
                        if (i < 5) {
                            setTimeout(() => {
                                addMd();
                            }, 300)
                        }
                    }
                };
                addMd();
            },
            save: function (isAuto) {
                this.$parent.save(this.editor.getContent(), isAuto);
            },
            change: function (e, src) {
                if (src !== "oninput") {
                    return;
                }
                this.save(true);
            }
        }
    }
</script>