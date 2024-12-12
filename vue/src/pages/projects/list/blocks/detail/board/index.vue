<template>
    <el-scrollbar>
        <div v-if="loaded" class="board" :style="'width:' + width + 'px'">
            <Column v-for="column in columns" :projectId="value.id" :key="column.id" :data="column" />
        </div>
    </el-scrollbar>
</template>
<script>
import Column from "./column";

export default {
    components: { Column },
    props: {
        value: Object
    },
    data() {
        return {
            loaded: false,
            data: {},
            width: 0,
            columns: [],
        };
    },
    async created() {
        await $.lib('drag-drop.js')
        this.loaded = true
        $.on("thingUpdate", this.thingChange);
        const { todoGroup, id: projectId } = this.value;
        this.columns = [...todoGroup, { title: '未分类', id: '-1' }];
        this.columns.forEach((item) => {
            item.sons = [];
        });
        this.width = (this.columns.length + 1) * 300;
        const things = await $.get({ url: "/do/list/thingForProject", data: { projectId, size: 500 } })
        if (!things || things.length === 0) {
            return;
        }
        things.forEach((item) => {
            let clm = this.getColumn(item.step);
            if (item.status === 1) {
                clm.sons.push(item);
            } else {
                clm.sons.unshift(item);
            }
        });
    },
    methods: {
        // 监听外部事件状态变更
        thingChange(thing, action) {
            debugger
            let column = this.getColumn(thing.tag);
            if (!column) {
                return;
            }
            let things = column.sons;
            if (action === "add") {
                return things.unshift(thing);
            }
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
        getColumn(id) {
            let column;
            let len = this.columns.length
            for (let i = 0; i < len; i++) {
                column = this.columns[i];
                if (column.id === id) {
                    return column;
                }
            }
            return this.columns[len - 1];
        },
        remove(id) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].id === id) {
                    this.columns.splice(i, 1);
                }
            }
        },
    },
};
</script>
<style scoped lang="scss">
.board {
    margin: 0 15px;
    display: flex;
    height: 84vh;
    border-radius: .15rem;
}
</style>