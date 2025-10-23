<template>
    <el-row v-if="pointList && pointList.length > 0">
        <el-col :span="10">
            <h3>页面权限点</h3>
            <el-checkbox-group v-model="checked" @change="change">
                <el-checkbox v-for="point in pointList" @change="(val) => selected(val, point)" :key="point.id"
                    :label="point.label" :value="point.id" />
            </el-checkbox-group>
        </el-col>
        <el-col :span="14" v-if="child">
            <h3>子页面权限点</h3>
            <ChildPage :page="child" :points="points" @update="changeChild" :pointData="pointData" />
        </el-col>
    </el-row>
</template>
<script>
import ChildPage from './childPage.vue';
export default {
    components: { ChildPage },
    props: {
        page: String,
        pointData: Object,
        points: Object
    },
    watch: {
        page() {
            this.init()
        }
    },
    data() {
        return {
            checked: null,
            pointList: null,
            child: null
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.checked = this.points[this.page] || []
            this.pointList = this.pointData[this.page] || []
            this.child = null
        },
        change() {
            this.$emit('update', this.page, this.checked)
        },
        changeChild(page, value) {
            this.$emit('update', page, value)
        },
        selected(val, point) {
            this.child = val === true && point.link ? point.link : null
        }
    },
}
</script>
<style scoped>
.a-checkbox {
    display: block;
}
</style>