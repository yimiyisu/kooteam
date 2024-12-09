<template>
    <el-carousel indicator-position="outside" height="410px" style="width: 685px">
        <el-carousel-item v-for="url in urls" :key="url" :src="url" lazy>
            <el-image :src="url" :fit="fit" class="image1" />
        </el-carousel-item>
    </el-carousel>
</template>
<script>
export default {
    data() {
        return {
            urls: [
                "https://a.ebus.vip/kooteam/banner/1.jpg",
                "https://a.ebus.vip/kooteam/banner/2.jpg",
            ],
        };
    },
};
</script>

<style scoped>
.a-carousel-horizontal {
    overflow: hidden;
}

.a-carousel_container {
    position: relative;
    height: 410px;
}

.image1 .a-image_inner {
    height: 400px;
    width: 674px;
    border: 5px solid #fff;
    border-radius: 5px;
}
</style>
