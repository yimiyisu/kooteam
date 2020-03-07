<template>
    <label for="J_attach_file" class="btn">
        <i class="ft icon">&#xe701;</i>附件
        <input id="J_attach_file" class="hide" type="file" name="file" @change="change"/>
    </label>
</template>
<script>
    export default {
        name: "detailAttachAction",
        inject: ["getThing", "log"],
        methods: {
            change(val) {
                let file = val.target.files,
                    thing = this.getThing();
                $.post({file: file[0], parentId: thing._id}, '/upload/file.do', (reback) => {
                    $.emit("uploadAttach", reback.data);
                    this.log("添加了附件 " + file[0].name);
                }, this)
            }
        },

    }
</script>