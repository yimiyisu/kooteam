<template>
    <el-tabs v-if="data" v-model="current">
        <el-tab-pane label="基础配置" name="basic">
            <div style="width:720px">
                <z-form label-width="160px" :beforeSubmit="submit" :data="data.app" :fields="fields" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="存储空间配置" name="cloud">
            <div style="width:720px">
                <Storage v-if="current === 'cloud'" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="企业平台登陆" name="third">
            <div style="width:720px">
                <Third v-if="current === 'third'" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="邮件服务配置" name="mail">
            <div style="width:720px">
                <Mail v-if="current === 'mail'" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="应用管理" name="app">
            <div style="width:960px">
                <Apps v-if="current === 'app'" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="其它配置" name="deepseek">
            <div style="width:960px">
                <Deepseek v-if="current === 'deepseek'" />
            </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="开发平台配置" name="open">
            <div style="width:720px">
                <Open v-if="current === 'open'" />
            </div>
        </el-tab-pane> -->
    </el-tabs>
</template>
<script>
import Apps from './blocks/apps.vue';
import Deepseek from './blocks/deepseek.vue';
import Mail from './blocks/mail.vue';
import Storage from './blocks/storage/index.vue';
import Third from './blocks/third/index.vue';

export default {
    components: { Third, Storage, Mail, Apps, Deepseek },
    data() {
        return {
            current: 'basic',
            data: null,
            fields: [
                { label: "系统名称", name: "title" },
                { label: "系统描述", name: "desc" },
                { label: "ICP备案号", name: "icp" },
                { label: "版权信息", name: "copyright" },
                { label: "默认主题色", name: "color", type: "color" },
                { label: "页面布局", name: "mode", type: "radiobox", options: [{ value: 'nm', label: '默认布局' }, { value: 'erp', label: '简易布局' }] },
                { label: "禁用多主题", name: "theme", type: "switch" },
                { label: "系统Logo", name: "logo", type: "image", tip: "建议尺寸64x64" },
                // { label: "欢迎背景图", name: "bg", type: "image", tip: "建议尺寸900x1500" }
            ]
        }
    },
    created() {
        this.load()
    },
    methods: {
        async load() {
            const result = await $.get({ url: "/api/zen/set" })
            this.data = result || {}
        },
        async submit(data) {
            await $.post({ url: "/api/zen/set", data: { app: data } });
            localStorage.removeItem("_skin_")
            window.location.reload()
            return false
        }
    },
}
</script>