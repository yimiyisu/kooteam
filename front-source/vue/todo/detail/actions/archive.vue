<template>
    <div class="btn" @click="click">
        <i class="ft icon">&#xe85f;</i>{{title}}
    </div>
</template>
<script>
    export default {
        inject: ["getThing", "close", "log"],
        props: ["target"],
        data() {
            return {
                archiveId: null
            }
        },
        computed: {
            title() {
                return this.archiveId ? "取消归档" : "归档";
            }
        },
        created() {
            this.target && (this.archiveId = this.target);
        },
        methods: {
            click() {
                let thing = this.getThing(), params = {}, url;
                if (this.archiveId) {
                    params["_id"] = this.archiveId;
                    url = "/thing/restore.do";
                } else {
                    params["_id"] = thing._id;
                    url = "/thing/archive.do";
                }
                $.post(params, url, (reback) => {
                    if (this.archiveId) {
                        this.archiveId = null;
                        this.log("取消任务归档");
                        return $.emit("thingUpdate", reback.data, "add");
                    }
                    this.archiveId = reback.data._id;
                    this.log("将任务归档");
                    $.emit("thingUpdate", thing, "remove");
                }, this);
            }
        }
    }
</script>
