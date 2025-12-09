<template>
    <el-menu v-if="apps" mode="horizontal" :default-active="appName" @select="change">
        <el-menu-item v-for="app in apps" :key="app.name" :index="app.name">
            {{ app.title }}
        </el-menu-item>
    </el-menu>
</template>
<script>
export default {
    computed: {
        title() {
            const { apps, appName } = this;
            for (let i = 0; i < apps.length; i++) {
                if (apps[i].name === appName) {
                    return apps[i].title
                }
            }
            return null;
        }
    },
    data() {
        return { configs: {}, appName: 'kooteam', apps: null }
    },
    mounted() {
        $.on('_appChange', (app) => {
            this.appName = app
        })
        this.apps = window._apps
    },
    methods: {
        change(app) {
            const { appName } = this
            if (app === appName) {
                return
            }
            $.loadApp(app)
        }
    },
}
</script>