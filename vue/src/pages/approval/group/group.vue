<template>
    <div v-if="current">
        <z-page-title value="流程管理" />
        <el-tabs v-model="current" type="card">
            <el-tab-pane v-for="app in apps" :key="app.id" :label="app.title" :name="app.name" />
        </el-tabs>
        <z-block :url="url">
            <template #default="list">
                <App :name="current" :list="list" />
            </template>
        </z-block>
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
    computed: {
        url() {
            return `/${this.current}/api/zen/flows`;
        }
    },
    async created() {
        const { apps } = await $.get({ url: "/api/system/apps" })
        this.apps = apps;
        this.current = apps[0].name
    },
};
</script>
