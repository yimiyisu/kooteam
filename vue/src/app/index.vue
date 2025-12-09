<template>
    <!-- <div>{{ info }}</div> -->
    <z-layout>
        <template #logoExtra>
            <AppList />
            <z-action title="待办详情" :later="300" fixed="thingDetail" width="1024px">
                <template #default="data">
                    <detail :data="data" />
                </template>
            </z-action>
            <z-action title="查看待办" :later="300" fixed="viewThingDetail" width="1024px">
                <template #default="data">
                    <viewDetail :data="data" />
                </template>
            </z-action>
        </template>
    </z-layout>
</template>

<script>
import AppList from './appList.vue';
import detail from './detail';
import viewDetail from './viewDetail';
export default {
    components: { detail, AppList, viewDetail },
    data() {
        return { detail, visible: false, info: {} }
    },
}
</script>
