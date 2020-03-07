<template>
    <div v-show="data.status !== 2" class="k-thing" :class="{finish:data.status}" @dblclick="dblclick" @click="detail"
         :data-id="data._id">
        <label @click.stop="doFinish" :data-id="data._id">
            <i class="z-icon"></i>
        </label>
        <div>{{data.title}}</div>
        <span v-if="data.finish<current">延期{{data.finish|time}}</span>
    </div>
</template>
<script>
    let now = new Date();
    now = now.getTime() % 1000;
    export default {
        props: ["data", "now"],
        computed: {
            current() {
                return this.now || now;
            }
        },
        methods: {
            doFinish: function (evt) {
                let cls = "finish",
                    id = this.data._id, status;
                let target = $(evt.currentTarget).parent();
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
                    projectId: this.data.projectId
                };
                $.post(param, "/thing/patch.do", function () {
                    this.data["status"] = status;
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