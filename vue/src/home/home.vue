<template>
    <div class="container">
        <div class="k-headers">
            <Header />
        </div>
        <div class="welcome">
            <div class="banners" style="dispaly: block">
                <el-row class="z-rows">
                    <el-col :span="16" class="z-16s">
                        <Banner />
                    </el-col>
                    <el-col :span="8" class="z-8s">
                        <h3>酷公司，用Kooteam</h3>
                        <div class="desc">甘特图，脑图，手绘白板，项目安排，人效管理。钉钉，企业微信，飞书，LADP全域企业账号支持</div>
                        <Login />
                    </el-col>
                </el-row>
            </div>
            <div class="seconds">
                <Main />
            </div>
        </div>
        <Group />
        <Foot class="foot" :info="info" />
    </div>
</template>
<script>
import Banner from "./banner.vue";
import Foot from "./foot.vue";
import Group from "./group.vue";
import Header from "./header.vue";
import Login from "./login.vue";
import Main from "./main.vue";
export default {
    components: { Header, Banner, Main, Foot, Group, Login },
    data() {
        return { info: null }
    },
    async created() {
        this.info = await $.get({ url: "/api/zen/app" }) || {}
    },
};
</script>
<style lang="scss" scoped>
.k-headers {
    height: 50px;
    background: #0396f2;
    padding-top: 12px;
    padding: 12px 40px 0 40px;
    max-width: 1280px;
}

.welcome {
    height: 700px;
    display: block;
    background: linear-gradient(to right bottom, var(--a-color-primary-dark-2), var(--a-color-primary-light-5));
    overflow: hidden;
    color: #fff;
    padding-top: 480px;
    margin-top: -480px;
    transform: skewY(-2deg);
    box-shadow: 0 2px 244px 0 var(--a-color-primary);
}

.banners {
    padding-top: 60px;
    height: 460px;
    max-width: 1200px;
    margin: 0 auto;
    transform: skewY(2deg);
    display: block;
}

.z-rows {
    text-rendering: optimizespeed;
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
}

.z-16s {
    width: 800px;
    display: inline-block;
    zoom: 1;
    box-sizing: border-box;
    vertical-align: top;
    text-rendering: auto;
}

.z-8s {
    width: 400px;
}

.seconds {
    position: relative;
    height: 240px;
    text-align: center;
    transform: skewY(2deg);
}

h3 {
    font-size: 40px;
    font-weight: normal;
    margin: 30px 0 18px 0;
}

.desc {
    font-size: 14px;
    line-height: 30px;
    margin-bottom: 50px;
    color: var(--a-color-primary-light-9);
}

.image2 {
    text-align: center;
}


.a-dialog__body {
    padding: 10px 20px;
}

.foot {
    margin: 20px 0;
    text-align: center;
    font-size: 14px;
}
</style>
