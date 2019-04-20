<template>
    <z-form label-width="90px" style="width: 100%">
        <div class="z-row header">
            <div class="z-20">
                <input class="input-title" type="text" name="title" :value="report.title"/>
                <input type="hidden" name="_id" :value="report._id"/>
            </div>
            <div class="z-4">
                <z-radio name="type" type="button" size="mini" v-model="mode">
                    <var value="1">周报</var>
                    <var value="2">日报</var>
                </z-radio>
            </div>
        </div>
        <div>
            <textarea id="J_reportEditor" :value="report.content" name="content" class="hide"></textarea>
        </div>
        <z-field class="form-item" label="抄送人">
            <z-employee :value="report.readers|parse" name="readers"></z-employee>
        </z-field>
        <z-field label="抄送邮箱">
            <z-input-tag name="mails" :value="report.mails" placeholder="抄送邮箱"></z-input-tag>
        </z-field>
        <z-field>
            <z-submit size="small" refresh="reports" @finish="save" action="/report/save.do">保存</z-submit>
            <z-submit size="small" @finish="save" :plain="false" type="text" action="/report/saveWithSend.do">立即发送
            </z-submit>
        </z-field>
    </z-form>
</template>
<script>
    import Config from "../util/config"

    export default {
        props: ["data"],
        data: function () {
            return {
                report: "",
                mode: "1",
                editor: null
            }
        },
        watch: {
            data: function (val) {
                this.report = val;
                if (this.mode === val.type) {
                    return this.template(this.mode);
                }
                this.mode = val.type;
            },
            mode: function (val) {
                this.template(val);
            }
        },
        mounted: function () {
            this.report = this.data;
            $.lib(["/tinymce/tinymce.min.js"], this.init);
        },
        destroyed: function () {
            // 修复编辑器二次渲染的异常
            this.editor.destroy();
        },
        methods: {
            init: function () {
                let that = this;
                let uploadURL = Config.uploadDomain() + "/upload/image.do";
                tinymce.init({
                    selector: "#J_reportEditor",
                    height: 380,
                    statusbar: false,
                    menubar: true,
                    language: 'zh_CN',
                    body_class: "article-body",
                    images_upload_url: uploadURL,
                    automatic_uploads: false,
                    plugins: [
                        'advlist autolink lists link image charmap emoticons anchor',
                        'searchreplace visualblocks',
                        'insertdatetime media table paste'
                    ],
                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
                    content_css: ["//a.yimiyisu.com/zeto/lib/zetoui.css"]
                }).then(function (editors) {
                    that.editor = editors[0];
                    // 加载默认模版
                    that.template(that.mode);
                });
            },
            template: function (val) {
                if (this.report._id) {
                    return;
                }
                $.http({mode: val}, "/report/template.do", function (reback) {
                    let data = reback.data, report = this.report;
                    report.title = data.title;
                    report.readers = data.readers;
                    report.mails = data.mails;
                    if (data.content) {
                        this.editor.setContent(data.content);
                    }
                }, this);
            },
            save: function (reback) {
                let id = reback.data._id;
                if (id) {
                    this.report._id = id;
                }
            }
        }
    }
</script>