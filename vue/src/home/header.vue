<template>
    <el-row>
        <el-col :span="10">
            <div class="kooteam">
                <Logo />
            </div>
            <span>轻量级的团队协作工具</span>
        </el-col>
        <el-col :span="14">
            <span>信创级安全标准，私有化独立部署</span>
        </el-col>
    </el-row>
</template>
<script>
import Logo from "../app/logo";
export default {
    components: { Logo },
};
</script>
<style scoped>
.a-row {
    color: #fff;
    height: 50px;
    position: relative;
    max-width: 1680px;
    z-index: 2;
    margin: 20px auto;
}

.a-col-10 {
    font-size: 12px;
}

.a-col-14 {
    text-align: right;
}

.kooteam {
    width: 150px;
    display: inline-block;
    margin-right: 20px;
}
</style>
