<template>
    <h3>我的待办</h3>
    <el-row ref="list" v-if="loaded">
        <!--四个象限-->
        <Quadrant v-for="item in data" @refresh="load" :key="item.tag" :data="item" :now="now" />
    </el-row>
</template>
<script>
import Quadrant from "./quadrant";
export default {
    name: "task-my",
    components: { Quadrant },
    data() {
        return {
            sortor: null,
            loaded: false,
            things: [],
            data: [
                { tag: "a", value: 1, title: "重要且紧急", sons: [] },
                { tag: "b", value: 2, title: "重要不紧急", sons: [] },
                { tag: "c", value: 3, title: "紧急不重要", sons: [] },
                { tag: "d", value: 4, title: "不重要不紧急", sons: [] },
            ],
            now: 0,
            height: 200,
        };
    },
    async mounted() {
        $.on("thingUpdate", this.thingChange);
        this.load()
        await $.lib('drag-drop.js')
        this.loaded = true
    },
    beforeUnmount() {
        $.off("thingUpdate");
    },
    methods: {
        async load() {
            let date = new Date();
            this.now = parseInt(date.getTime() / 1000);
            const list = await $.get({ url: "/do/list/thingLatest", data: { pageSize: 200 } });
            if (!list || list.length === 0) {
                return;
            }
            this.list = []
            let item,
                quadrant,
                i = 0;
            for (; i < list.length; i++) {
                item = list[i];
                quadrant = this.getQuadrant(item.quadrant);
                if (quadrant) {
                    quadrant.sons.push(item);
                }
            }
        },
        //data数组中添加元素
        thingChange(thing, action) {
            let quadrant = this.getQuadrant(thing.quadrant);
            if (!quadrant) {
                return;
            }
            let things = quadrant.sons;
            if (action === "add") {
                return things.unshift(thing);
            }
            //data数组中删除元素
            for (let i = 0; i < things.length; i++) {
                if (things[i].id === thing.id) {
                    if (action === "remove") {
                        things.splice(i, 1);
                    } else {
                        things[i][action] = thing[action];
                    }
                    return;
                }
            }
        },
        getQuadrant(quadrant) {
            let data;
            for (let i = 0; i < 4; i++) {
                data = this.data[i];
                if (data.value === quadrant) {
                    return data;
                }
            }
            return null;
        },
    },
};
</script>
<style scoped>
h3 {
    margin: 0;
    font-size: 16px;
}
</style>
