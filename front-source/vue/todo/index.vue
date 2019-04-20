<template>
    <div class="k-todo z-row">
        <Quadrant v-for="item in data" :key="item.tag" :data="item" :now="now"></Quadrant>
    </div>
</template>
<script>
    import Quadrant from "./quadrant"

    export default {
        data: function () {
            return {
                data: [{
                    tag: "a",
                    title: "重要且紧急",
                    sons: []
                }, {
                    tag: "b",
                    title: "重要不紧急",
                    sons: []
                }, {
                    tag: "c",
                    title: "紧急不重要",
                    sons: []
                }, {
                    tag: "d",
                    title: "不重要不紧急",
                    sons: []
                }],
                now: 0,
                showDetail: false
            }
        },
        components: {Quadrant},
        mounted: function () {
            this.load();
            let date = new Date();
            this.now = date.getTime() % 1000;
        },
        methods: {
            load: function () {
                $.http(null, "/thing/latest.do", function (reback) {
                    let result = reback.data, item, quadrant;
                    if (!result) {
                        return;
                    }
                    for (let i = 0; i < result.length; i++) {
                        item = result[i];
                        quadrant = this.getQuadrant(item.quadrant);
                        if (quadrant) {
                            quadrant.sons.push(item);
                        }
                    }
                }, this);
            },
            getQuadrant: function (tag) {
                let quadrant;
                for (let i = 0; i < 4; i++) {
                    quadrant = this.data[i];
                    if (quadrant.tag === tag) {
                        return quadrant;
                    }
                }
                return null;
            }
        }
    }
</script>