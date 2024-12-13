<template>
    <z-layout>
        <template #logo>
            <div class="title">
                <logo />
            </div>
        </template>
        <template #profile>
            <mods />
        </template>
        <span v-if="profile.env === 'demo'">演示环境数据每日自动清理，请勿存储个人数据</span>
        <z-action title="待办详情" :later="300" fixed="thingDetail" width="1024px">
            <template #default="data">
                <detail :data="data" />
            </template>
        </z-action>
    </z-layout>
</template>

<script>
import detail from "./detail";
import logo from './logo';
import mods from './mods.vue';
export default {
    inject: ["profile"],
    components: { logo, detail, mods },
    data() {
        return { detail };
    }
};
</script>
<style lang="scss" scoped>
.title {
    position: absolute;
    left: 10px;
    top: 6px;

    :deep(svg) {
        width: 108px;
    }
}
</style>