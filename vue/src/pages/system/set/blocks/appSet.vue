<template>
    <z-action :beforeShow="show" :url="url" :title="value.title" :icon="ISettings" link :fields="fields" />
</template>
<script>
import ISettings from '@icons/settings';
export default {
    props: { value: Object },
    setup(props) {
        const url = `/${props.value.name}/api/zen/set`
        const show = async () => {
            return await $.get({ url })
        }
        const fields = [
            {
                name: 'app',
                children: [{ label: "系统名称", name: "title" },
                { label: "系统描述", name: "desc" },
                { label: "ICP备案号", name: "icp" },
                { label: "版权信息", name: "copyright" },
                { label: "默认主题色", name: "color", type: "color" },
                { label: "页面布局", name: "mode", type: "radiobox", options: [{ value: 'nm', label: '默认布局' }, { value: 'erp', label: '简易布局' }] },
                { label: "禁用多主题", name: "theme", type: "switch" },
                { label: "系统Logo", name: "logo", type: "image", tip: "建议尺寸64x64" },]
            }
        ];
        return { fields, ISettings, url, show }
    }
}
</script>