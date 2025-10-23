<template>
    <z-table name="9qcj6pjk" :entitys="entitys">
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
    name: 'p-9qcj6pjk',
    provide: { configs },
    data() {
        return {
            entitys: {
                messageType: { "label": "消息类型", code:"messageType", default:"text" },
                config: { "label": "配置", "type": "json" },
                configs: {
                    "label": "配置", "type": "table", fields: [
                        { "label": "名称", "type": "input", "name": "name" },
                        { "label": "描述", "type": "input", "name": "description" },
                        { "label": "默认值", "type": "input", "name": "defaultValue" },
                    ]
                }
            }
        }
    },
}
</script>
