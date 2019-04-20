<template>
    <div v-show="data.status !== 2" class="k-thing" :class="{finish:data.status}" @click="detail"
         :data-id="data._id">
        <label @click.stop="doFinish" :data-id="data._id">
            <i class="z-icon"></i>
        </label>
        <div>{{data.title}}</div>
        <span v-if="data.finish<now">延期{{data.finish|time}}</span>
    </div>
</template>
<script>

    export default {
        props: ["data", "now"],
        methods: {
            sync: function (value) {
                let item = this.data;
                if (value._id !== item._id) {
                    return;
                }
                if (item.title !== value.title) {
                    item.title = value.title;
                }
            },
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
                $.http(param, "/thing/patch.do", function () {
                    this.data["status"] = status;
                    let parent = this.$parent;
                    if (parent.sort) {
                        parent.sort(id, status);
                    }
                }, this);
            },
            detail: function () {
                $.on("thingUpdate", this.sync);
                $.emit("thingDetail", this.data._id);
            }
        }
    }
</script>