<template>
    <el-checkbox-group v-if="pointList" v-model="checked" @change="change">
        <el-checkbox v-for="point in pointList" :key="point.id" :label="point.label" :value="point.id" />
    </el-checkbox-group>
</template>
<script>
export default {
    inheritAttrs: false,
    props: {
        page: String,
        pointData: Object,
        points: Object
    },
    data() {
        return {
            pointList: null,
            checked: null
        }
    },
    created() {
        this.checked = this.points[this.page] || []
        this.pointList = this.pointData[this.page] || []
    },
    methods: {
        change() {
            this.$emit('update', this.page, this.checked)
        }
    },
}
</script>
<style scoped>
.a-checkbox {
    display: block;
}
</style>