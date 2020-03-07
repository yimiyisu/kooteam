<template>
    <div class="list">
        <div class="doc-item" v-for="(item,idx) in data" :class="{'active':current===item._id}"
             @click="select(item,$event)" :key="item._id">{{item.title}}<span>
                {{item._id|idate}}
            <z-confirm type="text" tip="确定删除吗？" :destory="{'index':idx,'parent':data}" @click="remove(item)"
                       class="z-icon hover">&#xe5c9;</z-confirm>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                data: [],
                current: null,
                total: 0,
            }
        },
        mounted: function () {
            $.get(null, "/note/my.do", function (reback) {
                let result = reback.data;
                this.data = result.data;
                this.total = reback.total;
                if (this.load()) {
                    return;
                }
                this.$parent.value = this.data[0];

            }, this);
        },
        methods: {
            remove(item) {
                $.get({_id: item._source}, '/note/remove.do', (reback) => {
                    if (reback.action === 0) {
                        for (let i = 0; i < this.data.length; i++) {
                            if (this.data[i]._source === item._source) {
                                this.data.splice(i, 1);
                            }
                            if (this.current === item._id) {
                                this.current = item._id;
                                this.$parent.value = item;
                                let href = $.setParam("rid", this.data[0]._id);
                                window.history.replaceState(null, null, href);
                                this.load();
                            }
                        }
                    }
                });
            },
            select: function (item) {
                if (this.current === item._id) {
                    return;
                }
                this.current = item._id;
                this.$parent.value = item;
                let href = $.setParam("rid", item._id);
                window.history.replaceState(null, null, href);
            },
            load: function () {
                let rid = $.getParam("rid");
                if (!rid) {
                    return false;
                }
                this.current = rid;
                $.get({_id: rid}, "/get/note.json", function (reback) {
                    this.$parent.value = reback.data;
                }, this);
                return true;
            }
        }
    }
</script>