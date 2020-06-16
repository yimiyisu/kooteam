<template>
    <z-form label-width="90px" style="width: 100%">
        <div class="z-row header">
            <div class="z-20">
                <input class="input-title" type="text" name="title" :value="report.title"/>
                <input type="hidden" name="_id" :value="report._id"/>
            </div>
            <div class="z-4">
                <z-radio v-if="!data._id" name="type" type="button" size="mini" v-model="mode">
                    <var value="2">日报</var>
                    <var value="1">周报</var>
                </z-radio>
            </div>
        </div>
        <z-editor :value="report.content" height="500" name="content"></z-editor>
        <z-employee style="margin-top: 18px" label="抄送人" :value="readers" name="readers"></z-employee>
        <z-input-tag label="抄送邮箱" name="mails" :value="report.mails" placeholder="抄送邮箱"></z-input-tag>
        <z-field>
            <z-submit @finish="save" action="/report/save.do">保存</z-submit>
            <z-submit @finish="save" type="text" action="/report/saveWithSend.do">立即发送</z-submit>
        </z-field>
    </z-form>
</template>
<script>

    export default {
        props: ["data"],
        data() {
            return {
                report: {},
                mode: "2",
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
            data(val) {
                val && (this.report = val);
                if (this.mode === val.type) {
                    return this.template(this.mode);
                }
                this.mode = val.type;
            },
            mode(val) {
                this.template(val);
            }
        },
        created() {
            this.report = this.data || {};
            this.template(this.mode);
        },
        methods: {
            async template(val) {
                if (this.report._id) {
                    return;
                }
                let data = await $.post({mode: val}, "/report/template.do");
                let report = this.report;
                report.title = data.title;
                report.readers = data.readers;
                report.mails = data.mails;
                data.content && (report.content = data.content);
            },
            save(reback) {
                // $.refresh(this);
                this.$root.refresh();
                reback.data && (this.report._id = reback.data._id);
            }
        }
    }
</script>