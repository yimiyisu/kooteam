<template>
    <z-row :gutter="20" v-if="isInit">
        <Quadrant v-for="item in data" :key="item.tag" :height="height" :data="item" :now="now"></Quadrant>
    </z-row>
</template>
<script>
    import Quadrant from "./quadrant"

    export default {
        props: ["things"],
        data() {
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
                height: 200,
                isInit: false
            }
        },
        components: {Quadrant},
        created() {
            let date = new Date();
            this.now = date.getTime() % 1000;
            this.resize();
            $.on("thingUpdate", this.thingChange);
            window.addEventListener("resize", this.resize);
            if (!this.things || this.things.length === 0) {
                return;
            }
            let item, quadrant, i = 0, things = this.things;
            for (; i < things.length; i++) {
                item = things[i];
                quadrant = this.getQuadrant(item.quadrant);
                if (quadrant) {
                    quadrant.sons.push(item);
                }
            }
        },
        destroyed: function () {
            $.off("thingUpdate");
            window.removeEventListener('resize', this.resize);
        },
        methods: {
            thingChange(thing, action) {
                let quadrant = this.getQuadrant(thing.quadrant);
                if (!quadrant) {
                    return;
                }
                let things = quadrant.sons;
                for (let i = 0; i < things.length; i++) {
                    if (things[i]._id === thing._id) {
                        if (action === "remove") {
                            things.splice(i, 1);
                        } else {
                            things[i][action] = thing[action];
                        }
                        return;
                    }
                }
            },
            resize() {
                let height = parseInt(($("body").height() - 180) / 2);
                height > this.height && (this.height = height);
                this.isInit = true;
            },
            getQuadrant(quadrant) {
                let data;
                for (let i = 0; i < 4; i++) {
                    data = this.data[i];
                    if (data.tag === quadrant) {
                        return data;
                    }
                }
                return null;
            }
        }
    }
</script>