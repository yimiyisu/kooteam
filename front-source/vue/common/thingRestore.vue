<template>
    <z-execute type="link" :action="'/thing/restore.do?_id='+value"
               :callback="callback">取消归档
    </z-execute>
</template>
<script>
    export default {
        props: ["value"],
        methods: {
            callback(reback) {
                $.emit("thingUpdate", reback.data, "add");
            }
        }
    }
</script>