export default {
    name: "excel",
    props: ['readonly', 'value'],
    data() {
        return {
            instance: null
        }
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
        window.addEventListener("keydown", this.keydown);
    },
    render() {
        return <div></div>
    },
    destroyed() {
        window.removeEventListener("keydown", this.keydown);
    },
    methods: {
        keydown(e) {
            if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
                e.stopPropagation();
                e.preventDefault();
                this.instance && this.save(this.instance.getData());
            }
        },
        init() {
            let content = this.value, x = window.x;
            if (this.instance) {
                return content && this.instance.loadData(JSON.parse(content));
            }
            this.instance = x.spreadsheet(this.$el, {
                view: {height: () => document.documentElement.clientHeight - 36}
            }).change(data => {
                this.save(data);
            });
            $("textarea", this.$el).on("keydown", this.keydown);
            content && this.instance.loadData(JSON.parse(content));
        },
        save(data) {
            this.$parent.updateContent(JSON.stringify(data));
        }
    }
}