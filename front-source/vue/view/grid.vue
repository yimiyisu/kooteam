<template>
    <div></div>
</template>
<script>
    export default {
        props: ["value"],
        data() {
            return {}
        },
        mounted() {
            let x = window.x;
            if (x && x.spreadsheet) {
                return this.init();
            }
            let that = this;
            $.lib(["xspreadsheet/xspreadsheet.js", "xspreadsheet/xspreadsheet.css"], function () {
                window.x.spreadsheet.locale('zh-cn');
                that.init();
            });
        },
        methods: {
            init() {
                let content = this.value.content, x = window.x;
                if (this.instance) {
                    return content && this.instance.loadData(JSON.parse(content));
                }
                this.instance = x.spreadsheet(this.$el, {
                    view: {
                        height: () => document.documentElement.clientHeight - 90,
                        width: () => {
                            return document.documentElement.clientWidth
                        }
                    },
                    showToolbar: false,
                    showContextmenu: false,
                    style: {}
                });
                content && this.instance.loadData(JSON.parse(content));
            }
        }
    }
</script>