<template>
    <z-page-title />
    <el-tabs v-model="current">
        <el-tab-pane v-for="item in apps" :key="item.id" :label="item.title" :name="item.name" lazy>
            <z-block :url="item.url">
                <template #default="menudata">
                    <menuTree :data="menudata" :roleId="params.roleId" :appName="item.name" />
                </template>
            </z-block>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import configs from './.lowcode/configs';
import menuTree from './blocks/menuTree.vue';

export default {
    name: 'p-mw08g1vk',
    provide: { configs },
    props: {
        params: Object,
    },
    components: { menuTree },
    computed: {
        apps() {
            return this.appList.map((item) => {
                return { ...item, url: '/' + item.name + '/api/zen/menus' }
            })
        }
    },
    data() {
        return {
            appList: [],
            current: null,
            roleData: [],
        }
    },
    async created() {
        const appResult = await $.get({ url: "/api/system/apps" })
        this.appList = appResult.apps
        this.current = this.apps[0]?.name
    }
}
</script>