<template>
    <z-action mode="dialog" type="default" :beforeShow="show" class="btn" label="立即登录" size="large">
        <z-form size="large" label-width="100px" :data="formData" @keyup.enter="submit">
            <z-form-items :value="formData" :fields="fields" />
            <template #action$>
                <el-button v-if="showQR" type="primary" link @click="qr">使用手机扫码登录</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </template>
        </z-form>
    </z-action>
</template>
<script>
const QRList = ['dingding', 'wework', 'feishu']
export default {
    data: function () {
        return {
            formData: {},
            fields: [
                { name: "username", type: "input", label: "登录用户名" },
                { name: "password", type: "password", label: "账号密码", rules: { required: true, message: "" } },
            ],
            showQR: false,
        }
    },
    methods: {
        async show() {
            const data = await $.post({ url: "/api/auth/check", data: { host: location.origin } });
            if (data.logined) {
                return this.$router.push("/welcome")
            }
            const { loginMode } = data;
            if (data.passwordMode === "1" || loginMode === 'ladp') {
                this.showQR = QRList.includes(loginMode);
            } else {
                // 自动扫码登录
                await this.qr()
            }
        },
        async qr() {
            let result = await $.get({ url: "/api/auth/third" });
            $.open(result)
        },
        async submit() {
            const url = '/api/auth/login'
            let result = await $.post({ data: this.formData, url });
            $.token(result)
            const { reback } = this.$route.query
            if (reback) {
                return (location.href = decodeURIComponent(reback))
            }
            this.$router.push("/welcome")
        }
    },
};
</script>
<style lang="scss" scoped>
.btn {
    width: 160px;
    height: 50px;
    line-height: 50px;
    color: var(--a-color-primary);
    font-size: 20px;
}
</style>