<template>
    <div class="btn" @click="click">
        <i class="ft icon">&#xe85f;</i>归档
    </div>
</template>
<script>
    export default {
        inject: ["getThing", "close", "log"],
        methods: {
            click() {
                let thing = this.getThing();
                $.post({_id: thing._id}, '/thing/archive.do', (reback) => {
                    this.log("将这个任务归档");
                });
            }
        }
    }
</script>
