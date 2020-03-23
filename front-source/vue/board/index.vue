<template>
    <z-scrollbar v-if="width>0" :viewHeight="-100" :viewWidth="width">
        <z-draggable class="k-board-column" :list="columns" @end="save">
            <Column v-for="column in columns" :columns="columns" :now="now" :data="column" :key="column.tag"/>
        </z-draggable>
    </z-scrollbar>
</template>
<script>
    import Column from "./column"
    import InitData from "./data"

    const tagName = "未归类";
    export default {
        props: ["value"],
        data: function () {
            return {
                projectId: "",
                now: 0,
                data: {},
                width: 0,
                columns: []
            }
        },
        watch: {
            value: function () {
                this.init();
            }
        },
        components: {Column},
        created() {
            let date = new Date();
            this.now = parseInt(date.getTime() / 1000);
            this.init();
            $.on("thingUpdate", this.thingChange);
        },
        destroyed() {
            $.off("thingUpdate");
        },
        methods: {
            // 监听外部事件状态变更
            thingChange(thing, action) {
                let column = this.getColumn(thing.tag);
                if (!column) {
                    return;
                }
                let things = column.sons;
                if (action === "add") {
                    return things.unshift(thing);
                }
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
            init: function () {
                this.columns = [];
                this.projectId = $.getParam("id");
                let data = this.value;
                if (data.board) {
                    this.rndId = this.projectId;
                    this.columns = JSON.parse(data.board);
                } else {
                    this.rndId = zen.id();
                    this.columns = InitData;
                }
                this.columns.forEach((item) => {
                    !item.sons && (item.sons = [])
                });
                this.resize();
                // 初始化任务
                let things = data.things;
                if (!things || things.length === 0) {
                    return;
                }
                things.forEach(item => {
                    let clm = this.getColumn(item.tag);
                    if (item.status === 1) {
                        clm.sons.push(item);
                    } else {
                        clm.sons.unshift(item);
                    }
                });
                if (this.columns[0].tag === tagName && this.columns[0].length === 0) {
                    this.columns.splice(0, 1);
                }
            },
            resize: function () {
                this.width = this.columns.length * 320;
            },
            getColumn: function (tag) {
                let column;
                for (let i = 0; i < this.columns.length; i++) {
                    column = this.columns[i];
                    if (column.tag === tag) {
                        return column;
                    }
                }
                if (this.columns[0].tag === tagName) {
                    return this.columns[0];
                }
                let clm = {
                    tag: tagName,
                    title: tagName,
                    sons: []
                };
                this.columns.unshift(clm);
                return this.columns[0];
            },
            save: function (evt) {
                if (!evt.pullMode && evt.newIndex !== evt.oldIndex) {
                    let boards = {
                        id: this.rndId,
                        content: []
                    };
                    this.columns.forEach(clm => {
                        boards.content.push({
                            title: clm.title,
                            tag: clm.tag,
                            sons: []
                        });
                    });
                    let param = {
                        _id: this.projectId,
                        board: JSON.stringify(boards),
                    };
                    $.post(param, "/patch/project.json", function () {
                        this.resize();
                    }, this);
                }
            }
        }
    }
</script>