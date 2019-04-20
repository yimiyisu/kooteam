<template>
    <div>
        <div class="input-title" style="margin: 0 14px">{{report.title}}</div>
        <div class="article-body" v-html="report.content"></div>
    </div>
</template>
<script>
    export default {
        props: ["data"],
        watch: {
            data: function (val) {
                this.report = val;
            }
        },
        data: function () {
            return {
                report: {}
            }
        },
        mounted: function () {
            this.report = this.data;
        }
    }
</script>