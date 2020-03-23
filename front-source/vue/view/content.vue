<template>
    <div class="container" :class="bg">
        <div class="nav">
            <Chapter class="wrap" :data="tree" :current="current"></Chapter>
        </div>
        <div class="ft icon bold hover toggle" @click="toggle"></div>
        <z-scrollbar :height="-65" class="content">
            <keep-alive>
                <component :is="com" :value="data" :readonly="true"></component>
            </keep-alive>
        </z-scrollbar>
    </div>
</template>
<script>
    import Chapter from "./chapter"
    // import Flow from "./flow"
    import Rich from "./docs/rich"
    import Mind from "./docs/minder"
    import Graph from "./docs/mx"
    import Grid from "./docs/grid"

    export default {
        props: ["tree", "data", "current"],
        components: {Chapter},
        data() {
            return {
                bg: ""
            }
        },
        computed: {
            com() {
                let type = this.data.type;
                if (type === 1) {
                    return Rich;
                }
                if (type === 2) {
                    return Mind;
                }
                if (type === 5) {
                    return Graph;
                }
                if (type === 6) {
                    return Grid;
                }
                return null;
            }
        },
        watch: {
            data() {
                this.init()
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let val = this.data;
                if (val.type === 1 || val.type === 6) {
                    this.bg = "";
                    return this.$nextTick(function () {
                        Prism.highlightAll(this.$el);
                    });
                }
                this.bg = "bg";
            },
            toggle() {
                $("body").toggleClass("full");
                $.scrollTop(0);
            }
        }
    }
</script>