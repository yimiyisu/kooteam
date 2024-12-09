<template>
<div class="background">
    <el-steps  :active="active" align-center finish-status="success" >
        <el-step title="选择时间" />
        <el-step title="你的信息" />
    </el-steps>
    <div class="card">
        <div  v-if="active === 0">
            <chooseTime  @time-selected="handleTimeSelected" @next="nextActive" />
        </div>
        <div v-else-if="active === 1">
            <detailContect :receivedTime="receivedTime" @last="lastActive" />
        </div>
    </div>
</div>
</template>
<script>
import chooseTime from "./chooseTime.vue"
import detailContect from "./detailContect.vue";
export default {
    components:{chooseTime,detailContect},
    data() {
        return {
            active: 0,
            receivedTime: ''
        };
    },
    methods: {
        last() {
            this.active--;
            if (this.active < 0) {
                this.active = 1;
            }
        },
        handleTimeSelected(time) {
            this.receivedTime = time;
        },
        nextActive(nextActive) {
            this.active = nextActive;
        },
        lastActive(lastActive) {
            this.active = lastActive;
        }
    }
}
</script>
<style lang="scss" scoped>
.background{
    background-color: var(--a-border-color-lighter);
}
.card {
    width: 1000px;
    margin: auto;
    background-color: var(--a-bg-color);
    box-shadow: 0px 0px 10px var(--a-border-color);
}
.a-steps{
    width: 600px;
    margin: auto;
    padding: 20px;
}
</style>