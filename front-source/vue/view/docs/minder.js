export default {
    name: "docMinder",
    props: ["value"],
    data() {
        return {
            isLoaded: false
        }
    },
    created() {
        $.lib(["naotu.js"], this.load);
    },
    render() {
        return this.isLoaded ? (<t-minder value={this.value.content} readonly={true}></t-minder>)
            : null;
    },
    methods: {
        load() {
            this.isLoaded = true;
        }
    }
}