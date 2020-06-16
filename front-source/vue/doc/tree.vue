<template>
    <div class="list">
        <div class="doc-item" v-for="(item,idx) in data"
             :class="{'active':current===item._id}"
             @click="select(item,$event)" :key="item._id">
            {{item.title}}
            <span>
            <z-idate :value="item._id"></z-idate>
            <z-confirm type="text" tip="确定删除吗？"
                       :action="'/note/remove.do?_id='+item._id"
                       class="ft icon hover"
            >&#xe6c2;</z-confirm>
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
                total: 0
            };
        },
        mounted: function () {
            $.get(
                null,
                "/note/my.do",
                function (reback) {
                    let result = reback.data;
                    this.data = result.data;
                    this.total = reback.total;
                    if (this.load()) {
                        return;
                    }
                    this.$parent.value = this.data[0];
                },
                this
            );
        },
        methods: {
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
                $.get(
                    {_id: rid},
                    "/get/note.json",
                    function (reback) {
                        this.$parent.value = reback.data;
                    },
                    this
                );
                return true;
            }
        }
    };
</script>