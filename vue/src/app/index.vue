<template>
    <z-layout>
        <template #logoExtra>
            <AppList />
            <z-action title="待办详情" :later="300" fixed="thingDetail" width="1024px">
                <template #default="data">
                    <detail :data="data" />
                </template>
            </z-action>
        </template>
    </z-layout>
</template>

<script>
import AppList from './appList.vue';
import detail from './detail';
export default {
    components: { detail, AppList },
    data() {
        return { detail }
    },
}
</script>
