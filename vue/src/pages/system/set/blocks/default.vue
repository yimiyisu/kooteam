<template>
    <z-form :beforeSubmit="before" :fields="fields" url="/api/zen/set" title="系统设置" />
</template>
<script>
export default {
    data() {
        return {
            current: 'basic',
            fields: [
                {
                    label: "基础信息", name: "app", children: [
                        { label: "系统名称", name: "title" },
                        { label: "系统描述", name: "desc" },
                        { label: "默认主题色", name: "color", type: "color" },
                        { label: "禁用多主题", name: "theme", type: "switch" },
                        { label: "系统Logo", name: "logo", type: "image", tip: "建议尺寸64x64" },
                        { label: "欢迎背景图", name: "bg", type: "image", tip: "建议尺寸900x1500" }
                    ]
                },
                {
                    label: "自定义配置",
                    children: [
                        {
                            label: "配置详情", name: "selfs", type: "table",
                            fields: [
                                { label: "参数名", name: "name", width: 140 },
                                { label: "参数值", name: "value" },
                                {
                                    label: "是否加密", name: "encrypt", type: "switch", width: 72
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    },
    methods: {
        before({ app }) {
            (app.theme || !app.color) && localStorage.removeItem("_skin_")
        }
    },
}
</script>