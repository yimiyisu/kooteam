<template>
    <label for="J_attach_file" class="btn">
        <i class="ft icon">&#xe701;</i>附件
        <input id="J_attach_file" class="hide" type="file" name="file" @change="change"/>
    </label>
</template>
<script>
    export default {
        name: "detailAttachAction",
        methods: {
            async change(e) {
                $.emit("uploadAttach", e.target.files[0]);
            }
        },

    }
</script>