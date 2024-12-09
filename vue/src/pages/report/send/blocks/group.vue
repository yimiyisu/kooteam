<template>
    <el-form-item label="抄送组">
        <z-search v-model="value['groups']" depend="week_group" multiple />
    </el-form-item>
</template>
<script>
export default {
    props: {
        value: Object
    },
}
</script>