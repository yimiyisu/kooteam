<template>
    <div v-if="current">
        <z-page-title value="应用监控" />
        <el-tabs v-model="current" type="card">
            <el-tab-pane v-for="app in apps" :key="app.id" :label="app.title" :name="app.name" />
        </el-tabs>
        <App :name="current" />
    </div>
</template>

<script>
import App from './blocks/app.vue';
export default {
    components: { App },
    data() {
        return {
            current: null,
            apps: []
        };
    },
    async created() {
        const { apps } = await $.get({ url: "/api/system/apps" })
        this.apps = apps;
        this.current = apps[0].name
    },
};
</script>
