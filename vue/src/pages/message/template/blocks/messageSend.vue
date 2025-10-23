<template>
    <z-form-items :fields="fields" />
</template>
<script>

export default {
    props: {
        data: Object
    },
    data() {
        return {
            items: [],
            fields: [
                { label: '消息模版', name: 'templateName', type: 'text', default: this.data.name },
                { label: '消息标题', name: 'title' },
                { label: '消息内容', name: 'content', type: "textarea",  },
                { label: '手机号', name: 'mobile' },
                { label: '接收对象', name: 'recipient', type: 'input' },
                { label: '消息链接', name: 'link' },
                {
                    label: '消息附件', name: 'attach', type: 'attach', onChange: (value, formData) => {
                        formData.link = value.path
                    }
                },
            ]
        }
    },
    methods: {
        beforeSubmit(formData) {
            this.data.message = formData
            return this.data;
        },
    }
}
</script>
