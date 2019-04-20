<template>
    <div class="z-1">
        <div class="k-board-detail" @click="hideUserSearch">
            <z-draggable class="k-board-column" :list="columns" @end="save">
                <Column v-for="data in columns" :now="now" :data="data" :key="data.tag+projectId"></Column>
            </z-draggable>
            <Add></Add>
        </div>
    </div>
</template>
<script>
    import Column from "./column"
    import Add from "./add"
    import InitData from "./data"

    const tagName = "未归类";
    export default {
        props: ["value"],
        data: function () {
            return {
                projectId: "",
                now: 0,
                data: {},
                columns: []
            }
        },
        watch: {
            value: function () {
                this.init();
            }
        },
        components: {Column, Add},
        mounted: function () {
            this.init();
        },
        destroyed: function () {
            $.lockBody(false);
        },
        methods: {
            hideUserSearch: function () {
                this.$emit("hideUserSearch", true);
            },
            init: function () {
                this.columns = [];
                this.projectId = $.getParam("id");
                let date = new Date();
                let data = this.value;
                this.now = date.getTime() % 1000;
                if (data.board) {
                    let board = JSON.parse(data.board);
                    this.rndId = board.id;
                    this.columns = board.content;
                } else {
                    this.rndId = zen.id();
                    this.columns = InitData;
                }
                let width = this.columns.length * 310 + 360;
                $(".k-board-detail", this.$el).css("width", width + "px");
                $(".k-board-column", this.$el).css("width", this.columns.length * 310 + "px");
                for (let i = 0; i < this.columns.length; i++) {
                    this.columns[i].sons = [];
                }
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

                // 锁定页面高度
                this.$nextTick(function () {
                    $.lockBody(true);
                    let height = $(window).height() - 150;
                    if (height < 680) {
                        $("#J_app .k-project-toolbar").css("min-height", height + "px");
                    }
                    $(".column", this.$el).css("height", height + "px");
                    this.resize();
                });
            },
            resize: function () {
                let width = (this.columns.length + 2) * 300 + 20;
                $(".k-board-detail", this.$el).css("width", width + "px");
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
                    $.http(param, "/patch/project.json", function () {
                        this.resize();
                    }, this);
                }
            }
        }
    }
</script>