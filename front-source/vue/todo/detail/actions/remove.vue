<template>
    <z-confirm class="btn remove" tip="确定删除吗？" @click="remove">
        <i class="ft icon">&#xe6fb;</i> 删除
    </z-confirm>
</template>
<script>
    export default {
        inject: ["getThing", "close", "log"],
        methods: {
            remove() {
                let thing = this.getThing();
                $.post({_id: thing._id}, '/thing/remove.do', function (reback) {
                    this.log("删除了任务");
                    $.emit("thingUpdate", thing, "remove");
                    this.close();
                }, this);
            }
        }
    }
</script>