<template>
    <div v-show="data.status !== 2" class="k-thing" :class="{finish:data.status}" @dblclick="dblclick" @click="detail"
         :data-id="data._id">
        <label @click.stop="doFinish" :data-id="data._id">
            <i class="ft icon"></i>
        </label>
        <div><i v-if="overtime" class="ft bold red">!</i>{{data.title}}</div>
    </div>
</template>
<script>
    export default {
        props: ["data", "now"],
        computed: {
            current() {
                if (!this.now) {
                    let now = new Date();
                    return parseInt(now.getTime() / 1000);
                }
                return this.now;
            },
            overtime() {
                let item = this.data;
                return item.status === 0 && item.end && item.end < this.current;
            }
        },
        methods: {
            doFinish: function (evt) {
                let cls = "finish",
                    thing = this.data,
                    id = thing._id, status, uid = zen.user.uid;
                let target = $(evt.currentTarget).parent();
                if (uid !== thing.owner) {
                    return $.notice("只有负责人才能点击完成", "error");
                }
                if (target.hasClass(cls)) {
                    target.removeClass(cls);
                    status = 0;
                } else {
                    target.addClass(cls);
                    status = 1;
                }
                let param = {
                    _id: id,
                    status: status,
                    projectId: thing.projectId
                };
                $.post(param, "/thing/patch.do", function () {
                    thing["status"] = status;
                    let parent = this.$parent;
                    if (parent.sort) {
                        parent.sort(id, status);
                    }
                    let content = status ? "完成了任务" : "取消了完成";
                    $.post({thingId: id, content: content}, '/put/thingLog.json', function (reback) {

                    });
                }, this);
            },
            detail: function () {
                $.emit("thingDetail", this.data._id);
            },
            dblclick(evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
    }
</script>