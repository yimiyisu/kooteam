export default {
    name: "excel",
    props: ['readonly', 'value'],
    data() {
        return {
            xs: null
        }
    },
    watch: {
        value(val) {
            this.xs && this.xs.loadData(JSON.parse(val));
        }
    },
    mounted() {
        let x = window.x_spreadsheet;
        if (x) {
            return this.init();
        }
        let that = this;
        $.lib(["xspreadsheet/xspreadsheet.js", "xspreadsheet/xspreadsheet.css"], function () {
            x_spreadsheet.locale('zh-cn');
            that.init();
        });
        window.addEventListener("keydown", this.keydown);
    },
    render() {
        return <div></div>
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.keydown);
    },
    methods: {
        keydown(e) {
            if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.stopPropagation();
                e.preventDefault();
                this.xs && this.save(this.xs.getData());
            }
        },
        init() {
            let content = this.value, x = window.x_spreadsheet;
            if (this.xs) {
                return content && this.xs.loadData(JSON.parse(content));
            }
            this.xs = x(this.$el, {
                view: {height: () => document.documentElement.clientHeight - 36}
            }).change(data => {
                this.save(this.xs.getData());
            });
            $("textarea", this.$el).on("keydown", this.keydown);
            content && this.xs.loadData(JSON.parse(content));
        },
        save(data) {
            $.emit("docContentUpdate", JSON.stringify(data));
        }
    }
}