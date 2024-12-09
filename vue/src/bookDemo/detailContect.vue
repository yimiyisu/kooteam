<template>
    <div class="information">
        <h1>你的信息</h1>
        <h3>{{ receivedTime }}</h3>
        <z-form url="/do/put/book_demo" :closable="false" :data="data" :fields="fields" :rules="rules">
        </z-form>
        <el-button @click="last">返回</el-button>
    </div>
</template>
<script>
export default {
    props: {
        data: Object,
        name: String,
        receivedTime: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            rules: {
                "name": { "message": "此字段是必填字段。请输入您的姓名", "required": true, "type": "string" },
                "email": { "message": "请输入有效的电子邮件地址", "required": true, "type": "string" },
                "use_case": { "message": "此字段是必填字段。请输入您的需求", "required": true, "type": "string" }
            },
            fields: [
                { name: 'name', label: '姓名' },
                { name: 'mobile', label: '手机号' },
                { name: 'email', label: '电子邮箱地址' },
                { name: 'useCase', label: '应用需求说明', type: 'textarea' },
                { name: 'receivedTime', label: '', type: 'hidden' },
                {
                    name: 'invite',
                    label: '访客明细',
                    tip: "最多邀请 10 位访客参加会议。",
                    type: 'table',
                    max: 3,
                    min: 1,
                    fields: [
                        {
                            name: 'inviteEmail', label: '邀请访客电子邮箱'
                        },
                    ]
                }
            ],
        };
    },
    methods: {
        last() {
            let active = 0;
            console.log('active', active);
            this.$emit('last', active);
        },
    }
}
</script>
<style lang="scss" scoped>
.information {
    padding: 20px;
}

.a-button {
    font-size: 16px;
    width: 12.5%;
    display: inline-block;
    position: relative;
    left: 80%;
}
</style>