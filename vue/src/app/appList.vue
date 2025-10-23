<template>
    <el-dropdown v-if="apps" @command="change" :teleported="false">
        <span>
            {{ title }}
            <z-icon value="chevronDown" />
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="app in apps" :command="app.name" :disabled="app.name === appName"
                    :key="app.name">
                    <span :class="{ actived: app.name === appName }">{{ app.title }}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
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
    created() {
        this.apps = window._apps
        $.on('_appChange', (app) => {
            this.appName = app
        })
    },
    methods: {
        async change(app) {
            const { appName } = this
            if (app === appName) {
                return
            }
            $.loadApp(app)
        }
    },
}
</script>
<style lang="scss" scoped>
.a-dropdown {
    .a-icon {
        width: 14px;
        translate: 0 4px;
    }

    :deep(.is-disabled) {
        color: var(--a-color-primary);
    }
}
</style>