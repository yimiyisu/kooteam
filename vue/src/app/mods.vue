<template>
    <el-dropdown-item v-if="profile.env === 'demo'">
        <el-link target="_blank" href="https://gitee.com/yimiyisu/kooteam">源码地址</el-link>
    </el-dropdown-item>
    <el-dropdown-item v-if="profile.env === 'demo'">
        <el-link target="_blank"
            href="/kooteam/knowledge?id=67176b8a4f18a0&article=67176bbf0078d55c914f18a6">产品手册</el-link>
    </el-dropdown-item>
</template>
<script>
export default {
    inject: ["profile"],
    data() {
        return {
            fields: [{
                name: "modules",
                type: "table",
                fields: [
                    { label: "模块名", name: "name", width: 150 },
                    { label: "模块版本", name: "version", width: 120 },
                    { label: "服务地址", name: "api" }
                ]
            }]
        }
    }
}
</script>