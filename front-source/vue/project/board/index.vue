<template>
    <div class="k-board-detail">
        <z-scrollbar v-if="width>0" :viewHeight="-100" :viewWidth="width">
            <z-draggable class="k-board-column" draggable=".J_data" :list="columns" @end="save">
                <Column v-for="column in columns" :data="column" :key="column.tag"/>
                <AddColumn/>
            </z-draggable>
        </z-scrollbar>
    </div>
</template>
<script>
    import Column from "./column";
    import InitData from "./data";
    import AddColumn from "./addColum";

    const tagName = "未归类";
    export default {
        props: ["value"],
        components: {Column, AddColumn},
        data() {
            return {
                projectId: "",
                data: {},
                width: 0,
                columns: []
            };
        },
        provide() {
            return {
                getColumn: this.getColumn
            }
        },
        watch: {
            value() {
                this.init();
            }
        },
        created() {
            this.init();
            $.on("thingUpdate", this.thingChange);
            $.on("boardUpdate", this.rsync);
            $.on("boardRemove", this.remove);
        },
        beforeDestroy() {
            $.off("thingUpdate");
            $.off("boardUpdate");
            $.off("boardRemove");
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
            init() {
                this.columns = [];
                this.projectId = $.getParam("id");
                let data = this.value;
                if (data.board) {
                    this.columns = JSON.parse(data.board);
                } else {
                    this.columns = InitData;
                }
                this.columns.forEach(item => {
                    item.sons = [];
                    // !item.sons && (item.sons = [])
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
            resize() {
                this.width = (this.columns.length + 1) * 320;
            },
            getColumn(tag) {
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
            remove(tag) {
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.columns[i].tag === tag) {
                        this.columns.splice(i, 1);
                    }
                }
                this.rsync();
            },
            rsync(title, tag) {
                let borderId = this.data.borderId || zen.id() + 50;
                let board = [];
                this.columns.forEach(clm => {
                    board.push({
                        title: clm.title,
                        tag: clm.tag,
                        sons: []
                    });
                });
                // 新增一列
                if (title) {
                    if (!tag) {
                        // 新增列
                        borderId++;
                        let item = {
                            title: title,
                            tag: "t" + borderId,
                            sons: []
                        };
                        board.push(item);
                        this.columns.push(item);
                    } else {
                        // 更新列名
                        board.forEach(clm => {
                            if (clm.tag === tag) {
                                clm.title = title;
                            }
                        });
                    }
                }
                let param = {
                    _id: this.projectId,
                    borderId: borderId,
                    board: JSON.stringify(board)
                };
                $.post(
                    param,
                    "/patch/project.json",
                    function () {
                        this.resize();
                    },
                    this
                );
            },
            save(evt) {
                if (!evt.pullMode && evt.newIndex !== evt.oldIndex) {
                    this.rsync();
                }
            }
        }
    };
</script>