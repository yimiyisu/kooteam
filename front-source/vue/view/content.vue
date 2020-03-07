<template>
    <div class="container" :class="bg">
        <div class="nav" :class="{'active':isnav}">
            <Chapter class="wrap" :data="tree" :current="current"></Chapter>
        </div>
        <div class="content" @click="click">
            <div class="wrap" v-if="data.type===1">
                <div class="article-body" v-html="data.content"></div>
            </div>
            <!--<Flow v-if="data.type===3" :value="data" :readonly="true"></Flow>-->
            <Mind v-if="data.type===2" :readonly="true" :value="data.content"></Mind>
            <Graph v-if="data.type===5" :value="data"></Graph>
        </div>
    </div>
</template>
<script>
    import Chapter from "./chapter"
    // import Flow from "./flow"
    import Mind from "../doc/mind/minder"
    import Graph from "./graph"

    export default {
        props: ["tree", "data", "current", "isnav"],
        components: {Chapter, Mind, Graph},
        data() {
            return {
                bg: ""
            }
        },
        watch: {
            data(val) {
                if (val.type === 1) {
                    this.bg = "";
                } else {
                    this.bg = "bg";
                }
            }
        },
        mounted() {
            if (this.data.type !== 1) {
                this.bg = "bg";
            }
        },
        methods: {
            click() {
                if (this.isnav) {
                    this.$parent.showNav = false;
                    $.scrollTop(0);
                }
            }
        }
    }
</script>