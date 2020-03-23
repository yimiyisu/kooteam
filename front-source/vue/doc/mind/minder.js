export default {
    name: "minder",
    props: ["value", "readonly"],
    data() {
        return {
            isLoaded: false,
            key: "t-minder"
        }
    },
    created() {
        if (Vue.options.components[this.key]) {
            this.isLoaded = true;
        }
    },
    render() {
        if (this.isLoaded) {
            return (<t-minder value={this.value} readonly={this.readonly} on-input={this.save}></t-minder>);
        }
        this.load();
        return null;
    },
    methods: {
        save(val) {
            $.emit("docContentUpdate", val);
        },
        load() {
            let that = this;
            $.lib(["naotu.js"], function () {
                that.isLoaded = true;
            });
        }
    }
}