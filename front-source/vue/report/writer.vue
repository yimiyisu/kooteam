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
        <z-editor :value="report.content" height="500" name="content"></z-editor>
        <z-field class="form-item" label="抄送人">
            <z-employee :value="readers" name="readers"></z-employee>
        </z-field>
        <z-field label="抄送邮箱">
            <z-input-tag name="mails" :value="report.mails" placeholder="抄送邮箱"></z-input-tag>
        </z-field>
        <z-field>
            <z-submit size="small" refresh="reports" @finish="save" action="/report/save.do">保存</z-submit>
            <z-submit size="small" @finish="save" type="text" action="/report/saveWithSend.do">立即发送
            </z-submit>
        </z-field>
    </z-form>
</template>
<script>

    export default {
        props: ["data"],
        data: function () {
            return {
                report: {},
                mode: "1",
                editor: null
            }
        },
        computed: {
            readers() {
                let report = this.report;
                if (report && report.readers) {
                    return JSON.parse(report.readers);
                }
                return [];
            }
        },
        watch: {
            data: function (val) {
                val && (this.report = val);
                if (this.mode === val.type) {
                    return this.template(this.mode);
                }
                this.mode = val.type;
            },
            mode: function (val) {
                this.template(val);
            }
        },
        created() {
            this.report = this.data;
            this.template();
        },
        methods: {
            template: function (val) {
                if (this.report._id) {
                    return;
                }
                $.post({mode: val}, "/report/template.do", function (reback) {
                    let data = reback.data, report = this.report;
                    report.title = data.title;
                    report.readers = data.readers;
                    report.mails = data.mails;
                    data.content && (report.content = data.content);
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